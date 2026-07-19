import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Header from "./Header";

beforeEach(() => {
  const store = {};
  vi.stubGlobal("localStorage", {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach((k) => delete store[k]);
    }),
  });
});

describe("Header Component", () => {
  it("renders the stadium name or location correctly", () => {
    render(
      <Header
        selectedVenueId="metlife"
        onOpenCheckIn={() => {}}
        onToggleSidebar={() => {}}
      />,
    );
    expect(screen.getByText(/East Rutherford/i)).toBeDefined();
  });

  it("displays live weather if available", () => {
    render(
      <Header
        selectedVenueId="metlife"
        onOpenCheckIn={() => {}}
        onToggleSidebar={() => {}}
      />,
    );
    // Initial weather is loading or "--", just check the element exists
    expect(screen.getByText(/°C/)).toBeDefined();
  });

  it("renders standard title when not in ops mode", () => {
    render(
      <Header
        selectedVenueId="metlife"
        onOpenCheckIn={() => {}}
        onToggleSidebar={() => {}}
        activeSection="home"
      />,
    );
    expect(screen.getByText(/StadiaIQ/i)).toBeDefined();
  });
});
