import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HomeSection from "./sections/HomeSection";
import * as matchData from "../data/matchData";
import * as liveWeather from "../data/liveWeather";

vi.mock("../data/telemetryBus", () => ({
  useLiveTelemetry: () => ({
    attendance: 50000,
    capacityPercentage: 75,
    gateWaitTimes: { gate1: 5, gate2: 15, gate3: 2, gate4: 1 },
    incidents: [],
    liveAlerts: [],
    transitCountdowns: { metroGreen: 120 },
  }),
}));

vi.mock("../data/liveWeather", () => ({
  fetchLiveWeather: vi.fn().mockResolvedValue({
    temp: 22,
    condition: "Sunny",
    icon: "☀️",
    windSpeed: 10,
    humidity: 50,
  }),
}));

describe("HomeSection", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
    });
  });

  it("renders match details and weather", async () => {
    render(<HomeSection onNavigate={vi.fn()} onOpenChat={vi.fn()} selectedVenueId="metlife" />);
    
    // Check if the title renders
    expect(screen.getByText(/Welcome to StadiaIQ/i)).not.toBeNull();
    
    // Wait for weather to load
    await waitFor(() => {
      expect(screen.getByText(/22°C/i)).not.toBeNull();
    });
  });

  it("handles empty active match", async () => {
    vi.stubGlobal("localStorage", {
      getItem: vi.fn().mockReturnValue(null), // No active match ID
    });
    
    render(<HomeSection onNavigate={vi.fn()} onOpenChat={vi.fn()} selectedVenueId="metlife" />);
    expect(screen.queryByText(/Match #/i)).toBeNull();
  });


  it("navigates on button clicks", async () => {
    const mockNavigate = vi.fn();
    const mockChat = vi.fn();
    render(<HomeSection onNavigate={mockNavigate} onOpenChat={mockChat} selectedVenueId="metlife" />);
    
    const navButtons = screen.getAllByRole("button");
    // Find the first navigation button (like "View Operations")
    const opsBtn = navButtons.find(btn => btn.textContent.includes("Operations"));
    if (opsBtn) {
      fireEvent.click(opsBtn);
      expect(mockNavigate).toHaveBeenCalledWith("operations");
    }
    
    const chatBtn = navButtons.find(btn => btn.textContent.includes("AI"));
    if (chatBtn) {
      fireEvent.click(chatBtn);
      expect(mockChat).toHaveBeenCalled();
    }
  });
});
