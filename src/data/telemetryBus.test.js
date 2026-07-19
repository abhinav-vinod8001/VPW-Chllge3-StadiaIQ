import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getGlobalTelemetry, subscribeTelemetry, resolveIncidentGlobal } from './telemetryBus';

describe('telemetryBus', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should return initial global telemetry state', () => {
    const telemetry = getGlobalTelemetry();
    expect(telemetry).toBeDefined();
    expect(telemetry.attendance).toBeGreaterThanOrEqual(60000);
    expect(telemetry.gateWaitTimes).toBeDefined();
  });

  it('should resolve an incident globally', () => {
    const telemetry = getGlobalTelemetry();
    const incident = telemetry.incidents[0];
    
    if (incident) {
      resolveIncidentGlobal(incident.id);
      const updatedTelemetry = getGlobalTelemetry();
      const updatedIncident = updatedTelemetry.incidents.find(i => i.id === incident.id);
      expect(updatedIncident.status).toBe('Resolved');
      expect(updatedIncident.color).toBe('success');
    }
  });
});
