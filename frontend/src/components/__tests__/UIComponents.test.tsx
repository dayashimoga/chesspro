import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { Toast } from '../ui/Toast';
import { Modal } from '../ui/Modal';

describe('Reusable UI Components', () => {
  describe('Button', () => {
    it('renders text successfully', () => {
      render(<Button>Click Me</Button>);
      expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument();
    });

    it('handles click events successfully', () => {
      const clickMock = vi.fn();
      render(<Button onClick={clickMock}>Click Me</Button>);
      fireEvent.click(screen.getByRole('button'));
      expect(clickMock).toHaveBeenCalledTimes(1);
    });

    it('applies variant classes correctly', () => {
      const { container } = render(<Button variant="danger">Delete</Button>);
      const button = container.querySelector('button');
      expect(button).toHaveClass('bg-red-500/10');
    });
  });

  describe('Card', () => {
    it('renders children elements', () => {
      render(
        <Card>
          <h3>Title</h3>
          <p>Body content</p>
        </Card>
      );
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Body content')).toBeInTheDocument();
    });

    it('applies hover effects by default', () => {
      const { container } = render(<Card>Content</Card>);
      const card = container.firstChild;
      expect(card).toHaveClass('hover:-translate-y-0.5');
    });
  });

  describe('Badge', () => {
    it('renders and applies custom variant style', () => {
      render(<Badge variant="amber">XP Bonus</Badge>);
      const badge = screen.getByText('XP Bonus');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('bg-amber-500/10');
    });
  });

  describe('ProgressBar', () => {
    it('renders with custom width width percentage style', () => {
      const { container } = render(<ProgressBar percent={65} />);
      const progressFill = container.querySelector('.bg-gradient-to-r');
      expect(progressFill).toBeInTheDocument();
      expect(progressFill).toHaveStyle({ width: '65%' });
    });

    it('caps progress fill percentage at 100%', () => {
      const { container } = render(<ProgressBar percent={120} />);
      const progressFill = container.querySelector('.bg-gradient-to-r');
      expect(progressFill).toHaveStyle({ width: '100%' });
    });
  });

  describe('Toast', () => {
    it('renders message successfully', () => {
      render(<Toast message="Achievement Unlocked!" type="success" />);
      expect(screen.getByText('Achievement Unlocked!')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveClass('bg-emerald-500/90');
    });

    it('triggers onClose when close button clicked', () => {
      const closeMock = vi.fn();
      render(<Toast message="Notice" onClose={closeMock} />);
      fireEvent.click(screen.getByRole('button', { name: 'Close notification' }));
      expect(closeMock).toHaveBeenCalledTimes(1);
    });

    it('triggers onClose automatically after delay', () => {
      vi.useFakeTimers();
      const closeMock = vi.fn();
      render(<Toast message="Auto Close" duration={1000} onClose={closeMock} />);
      vi.advanceTimersByTime(1000);
      expect(closeMock).toHaveBeenCalledTimes(1);
      vi.useRealTimers();
    });
  });

  describe('Modal', () => {
    it('renders when isOpen is true', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
      render(
        <Modal isOpen={false} onClose={vi.fn()} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('triggers onClose when close button is clicked', () => {
      const closeMock = vi.fn();
      render(
        <Modal isOpen={true} onClose={closeMock} title="Test Modal">
          <p>Modal content</p>
        </Modal>
      );
      fireEvent.click(screen.getByRole('button', { name: 'Close modal' }));
      expect(closeMock).toHaveBeenCalledTimes(1);
    });
  });
});

