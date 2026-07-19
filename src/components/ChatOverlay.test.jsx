import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
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
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it('renders the chat button when closed', () => {
    render(<ChatOverlay isOpen={false} onClose={vi.fn()} />);
    const button = screen.getByRole('button', { name: /Open AI Assistant/i });
    expect(button).toBeTruthy();
  });

  it('renders the chat panel when open', () => {
    render(<ChatOverlay isOpen={true} onClose={vi.fn()} />);
    const header = screen.getByText(/StadiaIQ Assistant/i);
    expect(header).toBeTruthy();
  });

  it('allows user to type in input', () => {
    render(<ChatOverlay isOpen={true} onClose={vi.fn()} />);
    const input = screen.getByPlaceholderText(/Ask StadiaIQ/i);
    fireEvent.change(input, { target: { value: 'Hello AI' } });
    expect(input.value).toBe('Hello AI');
  });
});
