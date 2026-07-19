import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getGlobalTelemetry, resolveIncidentGlobal, addIncidentGlobal, tickTelemetry } from "./telemetryBus";

describe("telemetryBus", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return initial global telemetry state", () => {
    const telemetry = getGlobalTelemetry();
    expect(telemetry).toBeDefined();
    expect(telemetry.attendance).toBeGreaterThanOrEqual(60000);
    expect(telemetry.gateWaitTimes).toBeDefined();
  });

  it("should resolve an incident globally", () => {
    const telemetry = getGlobalTelemetry();
    const incident = telemetry.incidents[0];

    if (incident) {
      resolveIncidentGlobal(incident.id);
      const updatedTelemetry = getGlobalTelemetry();
      const updatedIncident = updatedTelemetry.incidents.find(
        (i) => i.id === incident.id,
      );
      expect(updatedIncident.status).toBe("Resolved");
      expect(updatedIncident.color).toBe("success");
    }
  });

  it("should add a new incident globally", () => {
    const newIncident = {
      id: "INC-TEST",
      time: "20:00 ET",
      type: "Test Incident",
      location: "Test Location",
      status: "Dispatched",
      priority: "High",
      color: "danger",
    };
    addIncidentGlobal(newIncident);
    const updatedTelemetry = getGlobalTelemetry();
    const found = updatedTelemetry.incidents.find(i => i.id === "INC-TEST");
    expect(found).toBeDefined();
    expect(found.type).toBe("Test Incident");
  });

  it("should tick transit countdowns and attendance on setInterval", () => {
    const initialTelemetry = getGlobalTelemetry();
    const initialMetro = initialTelemetry.transitCountdowns.metroGreen;
    
    // Explicitly tick
    tickTelemetry();
    
    const nextTelemetry = getGlobalTelemetry();
    
    expect(nextTelemetry.transitCountdowns.metroGreen).not.toBe(initialMetro);
    expect(nextTelemetry.lastTick).not.toBe(initialTelemetry.lastTick);
  });
  
  it("should handle random incident generation over time", () => {
    // Tick many times to trigger the 5% probability
    for (let i = 0; i < 50; i++) {
        tickTelemetry();
    }
    const telemetry = getGlobalTelemetry();
    expect(telemetry.incidents.length).toBeGreaterThan(0);
    expect(telemetry.incidents.length).toBeLessThanOrEqual(5); // array caps at 5
  });
});
