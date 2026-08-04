import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Login from "./Login";

// create a dummy store
const store = configureStore({
  reducer: {
    // add empty reducers if needed
    user: () => ({}),
  },
});

test("renders login button", () => {
  render(
    <Provider store={store}>
      <Login />
    </Provider>,
  );

  expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
});
