import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import OrderHistoryComponent from "./OrderHistory";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

describe("<OrderHistoryComponent />", () => {
  const mockOrders = [
    {
      orderNumber: "123",
      orderDate: "2023-10-01",
      total: 100,
      items: [
        {
          id: "1",
          productName: "Product 1",
          quantity: 2,
          price: 25,
        },
        {
          id: "2",
          productName: "Product 2",
          quantity: 1,
          price: 50,
        },
      ],
    },
    {
      orderNumber: "124",
      orderDate: "2023-10-02",
      total: 200,
      items: [
        {
          id: "3",
          productName: "Product 3",
          quantity: 4,
          price: 50,
        },
      ],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockOrders),
      })
    );
    localStorage.setItem("accountId", "testAccountId");
    localStorage.setItem("token", "testToken");
  });

  test("renders order history correctly", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <OrderHistoryComponent />
        </MemoryRouter>
      );
    });

    expect(screen.getByText("Order History")).toBeInTheDocument();
    expect(screen.getByText("2023-10-01 | Order #: 123")).toBeInTheDocument();
    expect(screen.getByText("2023-10-02 | Order #: 124")).toBeInTheDocument();
  });

  test("displays order details when an order is clicked", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <OrderHistoryComponent />
        </MemoryRouter>
      );
    });

    fireEvent.click(screen.getByText("2023-10-01 | Order #: 123"));

    expect(screen.getByText("Date: 2023-10-01 | Order #: 123 | Total: $100.00")).toBeInTheDocument();
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Quantity: 2")).toBeInTheDocument();
    expect(screen.getByText("Price: $25.00")).toBeInTheDocument();
    expect(screen.getByText("Subtotal: $50.00")).toBeInTheDocument();
    expect(screen.getByText("Product 2")).toBeInTheDocument();
    expect(screen.getByText("Quantity: 1")).toBeInTheDocument();
    expect(screen.getByText("Price: $50.00")).toBeInTheDocument();
    expect(screen.getByText("Subtotal: $50.00")).toBeInTheDocument();
  });

  test("displays message when no order is selected", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <OrderHistoryComponent />
        </MemoryRouter>
      );
    });

    expect(screen.getByText("Please select an order to view details.")).toBeInTheDocument();
  });
});