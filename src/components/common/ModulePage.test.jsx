import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ModulePage from "./ModulePage";

describe("ModulePage", () => {
  it("renders metrics and action buttons", () => {
    const onAction = vi.fn();

    render(
      <ModulePage
        title="Customers"
        description="Customer workspace"
        actions={[{ label: "Refresh", onClick: onAction }]}
        metrics={[
          { label: "Accounts", value: 3, helper: "Loaded" },
          { label: "Owners", value: 2, helper: "Assigned" },
        ]}
      >
        <p>Customer table</p>
      </ModulePage>,
    );

    expect(screen.getByRole("heading", { name: "Customers" })).toBeVisible();
    expect(screen.getByText("Customer workspace")).toBeVisible();
    expect(screen.getByRole("button", { name: "Refresh" })).toBeEnabled();
    expect(screen.getByText("Accounts")).toBeVisible();
    expect(screen.getByText("Customer table")).toBeVisible();
  });
});
