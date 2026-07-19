import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import ChatOverlay from './ChatOverlay';

vi.mock('../data/telemetryBus', () => ({
  useLiveTelemetry: () => ({
    incidents: [],
    gateWaitTimes: { gate2: 15 },
    transitCountdowns: { metroGreen: 180 },
    liveAlerts: []
  })
}));

describe('ChatOverlay Component', () => {
  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = function() {};
  });

  it('renders the chat button when closed', () => {
    render(<ChatOverlay isOpen={false} onClose={() => {}} />);
    const button = screen.getByRole('button', { name: /Open AI Assistant/i });
    expect(button).toBeDefined();
  });

  it('renders the chat panel when open', () => {
    render(<ChatOverlay isOpen={true} onClose={() => {}} />);
    const header = screen.getByText(/StadiaIQ Assistant/i);
    expect(header).toBeDefined();
  });

  it('allows user to type in input', () => {
    render(<ChatOverlay isOpen={true} onClose={() => {}} />);
    const input = screen.getByPlaceholderText(/Ask StadiaIQ/i);
    fireEvent.change(input, { target: { value: 'Hello AI' } });
    expect(input.value).toBe('Hello AI');
  });
});
