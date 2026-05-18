import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ThemeProvider from "../../context/ThemeProvider";
import ThemeToggle from "./ThemeToggle";

describe("ThemeToggle", () => {
  it("renders an accessible toggle button", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    expect(screen.getByRole("button", { name: "Toggle dark mode" })).toBeVisible();
  });
});
