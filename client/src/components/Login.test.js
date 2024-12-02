import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import LoginComponent from "./Login";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import "@testing-library/jest-dom";

// Login.test.js

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

describe("<LoginComponent />", () => {
  const mockLogin = jest.fn();
  const mockNavigate = jest.fn();
  const mockLocation = { state: { from: { pathname: "/some-path" } } };

  beforeEach(() => {
    jest.clearAllMocks();
    require("react-router-dom").useNavigate.mockReturnValue(mockNavigate);
    require("react-router-dom").useLocation.mockReturnValue(mockLocation);
    global.fetch = jest.fn();
  });

  test("renders login form correctly", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ login: mockLogin }}>
          <LoginComponent />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.getByText("Create Account")).toBeInTheDocument();
  });

  test("handles successful login", async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ tkn: "token", accountId: "123" }),
    };
    global.fetch.mockResolvedValueOnce(mockResponse);

    await act(async () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={{ login: mockLogin }}>
            <LoginComponent />
          </AuthContext.Provider>
        </MemoryRouter>
      );
    });

    fireEvent.change(screen.getByLabelText("Email Address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password" },
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Sign In"));
    });

    expect(mockLogin).toHaveBeenCalledWith("token", "123");
    expect(mockNavigate).toHaveBeenCalledWith("/some-path");
  });

  test("handles login error", async () => {
    const mockResponse = {
      ok: false,
      json: () => Promise.resolve({ message: "Invalid credentials" }),
    };
    global.fetch.mockResolvedValueOnce(mockResponse);

    await act(async () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={{ login: mockLogin }}>
            <LoginComponent />
          </AuthContext.Provider>
        </MemoryRouter>
      );
    });

    fireEvent.change(screen.getByLabelText("Email Address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "wrongpassword" },
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Sign In"));
    });

    expect(mockLogin).not.toHaveBeenCalled();
    expect(screen.getByText("Your password is incorrect. Please try again")).toBeInTheDocument();
  });
});