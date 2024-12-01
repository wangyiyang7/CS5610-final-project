// Home.test.js
import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import HomeComponent from "./Home";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

describe("<HomeComponent />", () => {
  const mockFunc = jest.fn();
  const mockItems = [
    { id: 1, productName: "Product 1", weight: "1kg", price: 10 },
    { id: 2, productName: "Product 2", weight: "2kg", price: 20 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockItems),
      })
    );
  });

  test("renders products and links correctly", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <HomeComponent func={mockFunc} />
        </MemoryRouter>
      );
    });

    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Product 2")).toBeInTheDocument();

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "/item/1");
    expect(links[1]).toHaveAttribute("href", "/item/2");
  });

  test("handles Add to Cart button click", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <HomeComponent func={mockFunc} />
        </MemoryRouter>
      );
    });

    const addToCartButton = screen.getAllByText("+ Add")[0];
    fireEvent.click(addToCartButton);

    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(mockFunc).toHaveBeenCalledWith(mockItems[0]);
  });
});
