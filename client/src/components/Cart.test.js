import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import CartComponent from "./Cart";
import "@testing-library/jest-dom";

const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      args[0].includes(
        "`ReactDOMTestUtils.act` is deprecated in favor of `React.act`"
      )
    ) {
      return;
    }
    originalError(...args);
  };
});

afterAll(() => {
  console.error = originalError;
});


beforeAll(() => {
  // Mock window.alert
  window.alert = jest.fn();
});

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

describe("CartComponent", () => {
  const mockCart = [
    { id: 1, productName: "Item 1", price: 10, quantity: 1 },
    { id: 2, productName: "Item 2", price: 20, quantity: 2 },
  ];

  beforeEach(() => {
    localStorage.setItem("cart", JSON.stringify(mockCart));
  });

  test("renders cart items from localStorage", () => {
    render(<CartComponent />);
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("$10")).toBeInTheDocument();
    expect(screen.getByText("$20")).toBeInTheDocument();
    expect(screen.getByText("Subtotal: $50.00")).toBeInTheDocument();
  });

  test("increments item quantity", () => {
    render(<CartComponent />);
    act(() => {
      fireEvent.click(screen.getAllByText("+")[0]);
    });

    const updatedCart = JSON.parse(localStorage.getItem("cart"));
    expect(updatedCart[0].quantity).toBe(2);
    expect(screen.getByText("Subtotal: $60.00")).toBeInTheDocument();
  });

  test("decrements item quantity and removes item when quantity is 0", () => {
    render(<CartComponent />);
    act(() => {
      fireEvent.click(screen.getAllByText("-")[0]);
    });

    const updatedCart = JSON.parse(localStorage.getItem("cart"));
    expect(updatedCart.length).toBe(1);
    expect(screen.getByText("Subtotal: $40.00")).toBeInTheDocument();
  });

  test("deletes an item", () => {
    render(<CartComponent />);
    act(() => {
      fireEvent.click(screen.getAllByText("Delete")[0]);
    });

    const updatedCart = JSON.parse(localStorage.getItem("cart"));
    expect(updatedCart.length).toBe(1);
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  test("handles checkout successfully", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
    );

    render(<CartComponent />);
    await act(async () => {
      fireEvent.click(screen.getByText("Proceed to checkout"));
    });

    expect(screen.getByText("Cart is empty...")).toBeInTheDocument();
    expect(localStorage.getItem("cart")).toBeNull();
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test("shows error on failed checkout", async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: false }));

    render(<CartComponent />);
    await act(async () => {
      fireEvent.click(screen.getByText("Proceed to checkout"));
    });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Cart is empty...")).not.toBeInTheDocument();
  });
});
