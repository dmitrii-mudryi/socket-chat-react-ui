import { render, screen } from '@testing-library/react';
import TypingIndicator from '../components/TypingIndicator';

it('displays typing status when provided', () => {
    render(<TypingIndicator typingStatus="Alice is typing..." />);
    expect(screen.getByText('Alice is typing...')).toBeInTheDocument();
});

it('displays nothing when typing status is empty', () => {
    render(<TypingIndicator typingStatus="" />);
    const typingIndicator = screen.getByTestId('typingIndicator');
    expect(typingIndicator).toBeEmptyDOMElement();
});

it('displays nothing when typing status is null', () => {
    render(<TypingIndicator typingStatus={null} />);
    const typingIndicator = screen.getByTestId('typingIndicator');
    expect(typingIndicator).toBeEmptyDOMElement();
});

it('displays nothing when typing status is undefined', () => {
    render(<TypingIndicator typingStatus={undefined} />);
    const typingIndicator = screen.getByTestId('typingIndicator');
    expect(typingIndicator).toBeEmptyDOMElement();
});