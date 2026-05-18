import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../App";

describe("AppRouter", () => {
  it("renders the public login route", async () => {
    window.history.pushState({}, "", "/login");

    render(<App />);

    expect(await screen.findByRole("heading", { name: "Login to CRM Suite" })).toBeVisible();
    expect(document.title).toContain("Login");
  });
});
