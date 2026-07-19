import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChatOverlay from "./ChatOverlay";

vi.mock("../data/aiEngine", () => ({
  generateAIResponseAsync: vi.fn().mockResolvedValue({
    text: "This is a mock AI response",
    isGroq: true,
    latency: 50,
  }),
}));

describe("ChatOverlay", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", {
      getItem: vi.fn().mockReturnValue("false"),
    });
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it("renders correctly when open", () => {
    render(<ChatOverlay isOpen={true} onClose={vi.fn()} activeSection="home" />);
    expect(screen.getByPlaceholderText(/Ask StadiaIQ/i)).not.toBeNull();
  });

  it("renders collapsed icon when closed", () => {
    render(<ChatOverlay isOpen={false} onClose={vi.fn()} activeSection="home" />);
    expect(screen.getByRole("button", { name: /Open AI Assistant/i })).not.toBeNull();
  });

  it("handles input and submission", async () => {
    render(<ChatOverlay isOpen={true} onClose={vi.fn()} activeSection="home" />);
    
    const input = screen.getByPlaceholderText(/Ask StadiaIQ/i);
    fireEvent.change(input, { target: { value: "Where is gate 4?" } });
    expect(input.value).toBe("Where is gate 4?");
    
    const submitBtn = screen.getByRole("button", { name: /Send Message/i });
    fireEvent.click(submitBtn);
    
    // Wait for AI response to appear and input to clear
    await waitFor(() => {
      expect(input.value).toBe("");
      expect(screen.getByText(/This is a mock AI response/i)).not.toBeNull();
    });
  });

  it("handles form submit via enter key", async () => {
    render(<ChatOverlay isOpen={true} onClose={vi.fn()} activeSection="home" />);
    const input = screen.getByPlaceholderText(/Ask StadiaIQ/i);
    fireEvent.change(input, { target: { value: "Where is gate 4?" } });
    
    // We can just trigger a submit on the form
    const form = input.closest("form");
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(input.value).toBe("");
      expect(screen.getByText(/This is a mock AI response/i)).not.toBeNull();
    });
  });

  it("calls onClose when close button clicked", () => {
    const onCloseMock = vi.fn();
    render(<ChatOverlay isOpen={true} onClose={onCloseMock} activeSection="home" />);
    
    const closeBtn = screen.getByRole("button", { name: /Close Chat/i });
    fireEvent.click(closeBtn);
    
    expect(onCloseMock).toHaveBeenCalled();
  });
});
