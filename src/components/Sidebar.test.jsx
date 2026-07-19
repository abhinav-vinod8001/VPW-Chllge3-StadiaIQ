import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Sidebar from "./Sidebar";

describe("Sidebar", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", {
      getItem: vi.fn().mockReturnValue("dark"),
      setItem: vi.fn(),
    });
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false }));
  });

  it("renders all navigation items", () => {
    render(
      <Sidebar
        activeSection="home"
        onNavigate={vi.fn()}
        sidebarOpen={true}
        onCloseSidebar={vi.fn()}
      />
    );
    expect(screen.getByText(/Home/i)).not.toBeNull();
    expect(screen.getByText(/Operations Intelligence/i)).not.toBeNull();
  });

  it("calls onNavigate when an item is clicked", () => {
    const mockNavigate = vi.fn();
    render(
      <Sidebar
        activeSection="home"
        onNavigate={mockNavigate}
        sidebarOpen={true}
        onCloseSidebar={vi.fn()}
      />
    );
    
    const opsBtn = screen.getByText(/Operations Intelligence/i);
    fireEvent.click(opsBtn);
    expect(mockNavigate).toHaveBeenCalledWith("operations");
  });

  it("toggles theme correctly", () => {
    render(
      <Sidebar
        activeSection="home"
        onNavigate={vi.fn()}
        sidebarOpen={true}
        onCloseSidebar={vi.fn()}
      />
    );
    
    const themeBtn = screen.getByRole("button", { name: /Toggle Theme/i });
    fireEvent.click(themeBtn);
    
    expect(localStorage.setItem).toHaveBeenCalledWith("stadiaiq_theme", "light");
  });

  it("handles install prompt if available", async () => {
    // Mock the beforeinstallprompt event
    render(
      <Sidebar
        activeSection="home"
        onNavigate={vi.fn()}
        sidebarOpen={true}
        onCloseSidebar={vi.fn()}
      />
    );
    
    const event = new Event("beforeinstallprompt");
    event.prompt = vi.fn();
    event.userChoice = Promise.resolve({ outcome: "accepted" });
    window.dispatchEvent(event);
    
    const installBtn = await waitFor(() => screen.getByRole("button", { name: /Install/i }));
    expect(installBtn).not.toBeNull();
    
    fireEvent.click(installBtn);
    expect(event.prompt).toHaveBeenCalled();
  });
});
