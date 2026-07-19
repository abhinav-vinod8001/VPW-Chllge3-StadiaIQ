import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Sidebar from './Sidebar';

describe('Sidebar Component', () => {
  it('renders navigation items', () => {
    render(<Sidebar currentSection="home" onNavigate={vi.fn()} isMobile={false} setMobileMenuOpen={vi.fn()} />);
    expect(screen.getByText(/Home/i)).toBeTruthy();
    expect(screen.getByText(/Operations/i)).toBeTruthy();
  });

  it('calls onNavigate when clicking an item', () => {
    const onNavigateMock = vi.fn();
    render(<Sidebar currentSection="home" onNavigate={onNavigateMock} isMobile={false} setMobileMenuOpen={vi.fn()} />);
    
    const opsButton = screen.getByText(/Operations/i);
    fireEvent.click(opsButton);
    expect(onNavigateMock).toHaveBeenCalledWith('operations');
  });
});
