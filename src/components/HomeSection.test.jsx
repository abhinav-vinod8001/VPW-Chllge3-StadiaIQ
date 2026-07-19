import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HomeSection from './sections/HomeSection';

// Mock the telemetry hook
vi.mock('../../data/telemetryBus', () => ({
  useLiveTelemetry: () => ({ attendance: 75000, capacity: 82500, matchMinute: 45, incidents: [] })
}));

describe('HomeSection Component', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
    });
  });

  it('renders without crashing', () => {
    render(<HomeSection onNavigate={vi.fn()} onOpenChat={vi.fn()} selectedVenueId="metlife" />);
    expect(screen.getByText(/Live Stadium Attendance/i)).toBeTruthy();
  });
});
