import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import ItemComponent from "./Item";
import { MemoryRouter, useParams } from "react-router-dom";
import "@testing-library/jest-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

describe("<ItemComponent />", () => {
  const mockAddToCart = jest.fn();
  const mockItem = {
    id: 1,
    productName: "Test Product",
    weight: "1kg",
    price: 10,
    ingredients: "Test Ingredients",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useParams.mockReturnValue({ id: "1" });
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockItem),
      })
    );
  });

  test("renders item details correctly", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ItemComponent addToCart={mockAddToCart} />
        </MemoryRouter>
      );
    });

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("1kg")).toBeInTheDocument();
    expect(screen.getByText("Price: $10")).toBeInTheDocument();
    expect(screen.getByText("Ingredients: $Test Ingredients")).toBeInTheDocument();
    expect(screen.getByAltText("Test Product")).toBeInTheDocument();
  });

  test("handles Add to Cart button click", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <ItemComponent addToCart={mockAddToCart} />
        </MemoryRouter>
      );
    });

    const addToCartButton = screen.getByText("+ Add");
    fireEvent.click(addToCartButton);

    expect(mockAddToCart).toHaveBeenCalledTimes(1);
    expect(mockAddToCart).toHaveBeenCalledWith(mockItem);
  });
});