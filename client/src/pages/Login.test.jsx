import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { vi } from "vitest";
import Login from "./Login";
import api from "../configs/api";
import toast from "react-hot-toast";

vi.mock("../configs/api", () => ({
  default: {
    post: vi.fn(),
  },
}));

vi.mock("react-hot-toast", () => ({
  default: vi.fn(),
  success: vi.fn(),
}));

const createStore = () =>
  configureStore({
    reducer: {
      auth: (state = {}, action) => state,
    },
  });

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    Object.defineProperty(window, "localStorage", {
      value: {
        setItem: vi.fn(),
        getItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });
  });

  test("renders login button", () => {
    render(
      <Provider store={createStore()}>
        <Login />
      </Provider>,
    );

    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("shows error toast on wrong password", async () => {
    api.post.mockRejectedValueOnce({
      response: {
        data: {
          message: "Invalid credentials",
        },
      },
    });

    render(
      <Provider store={createStore()}>
        <Login />
      </Provider>,
    );

    fireEvent.change(screen.getByPlaceholderText("Email id"), {
      target: {
        value: "test@test.com",
      },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: {
        value: "wrongpassword",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith("Invalid credentials");
    });
  });

  test("stores token after successful login", async () => {
    api.post.mockResolvedValueOnce({
      data: {
        token: "fake-jwt-token",
        message: "Login successful",
      },
    });

    render(
      <Provider store={createStore()}>
        <Login />
      </Provider>,
    );

    fireEvent.change(screen.getByPlaceholderText("Email id"), {
      target: {
        value: "test@test.com",
      },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: {
        value: "correctpassword",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        "token",
        "fake-jwt-token",
      );
    });
  });

  test("does not store token if API response has no token", async () => {
    api.post.mockResolvedValueOnce({
      data: {
        message: "Login successful",
      },
    });

    render(
      <Provider store={createStore()}>
        <Login />
      </Provider>,
    );

    fireEvent.change(screen.getByPlaceholderText("Email id"), {
      target: {
        value: "test@test.com",
      },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: {
        value: "correctpassword",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(window.localStorage.setItem).not.toHaveBeenCalled();
    });
  });
});
