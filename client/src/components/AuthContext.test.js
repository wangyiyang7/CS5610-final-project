import React from "react";
import { render, screen, act } from "@testing-library/react";
import { AuthProvider, AuthContext } from "./AuthContext";

describe("AuthContext", () => {
  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("initial state loads from localStorage", () => {
    localStorage.setItem("token", "mockToken");
    localStorage.setItem("accountId", "12345");

    let contextValues;

    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValues = value;
            return null;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    expect(contextValues.isAuthenticated).toBe(true);
    expect(contextValues.accountId).toBe("12345");
    expect(contextValues.loading).toBe(false);
  });

  test("login updates state and localStorage", () => {
    let contextValues;

    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValues = value;
            return null;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    act(() => {
      contextValues.login("mockToken", "67890");
    });

    expect(contextValues.isAuthenticated).toBe(true);
    expect(contextValues.accountId).toBe("67890");
    expect(localStorage.getItem("token")).toBe("mockToken");
    expect(localStorage.getItem("accountId")).toBe("67890");
  });

  test("logout clears state and localStorage", () => {
    localStorage.setItem("token", "mockToken");
    localStorage.setItem("accountId", "12345");

    let contextValues;

    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValues = value;
            return null;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    act(() => {
      contextValues.logout();
    });

    expect(contextValues.isAuthenticated).toBe(false);
    expect(contextValues.accountId).toBe(null);
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("accountId")).toBeNull();
  });
});
