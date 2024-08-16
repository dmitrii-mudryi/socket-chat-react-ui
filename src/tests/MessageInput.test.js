import { render, screen, fireEvent } from '@testing-library/react';
import MessageInput from '../components/MessageInput';

test('renders input field and send button', () => {
    render(<MessageInput sendMessage={jest.fn()} handleTyping={jest.fn()} />);
    expect(screen.getByPlaceholderText(/Enter your message/i)).toBeInTheDocument();
    expect(screen.getByText(/Send/i)).toBeInTheDocument();
});

test('calls sendMessage with input value and clears input on send button click', () => {
    const sendMessage = jest.fn();
    render(<MessageInput sendMessage={sendMessage} handleTyping={jest.fn()} />);
    const inputElement = screen.getByPlaceholderText(/Enter your message/i);
    fireEvent.change(inputElement, { target: { value: 'Hello' } });
    fireEvent.click(screen.getByText(/Send/i));
    expect(sendMessage).toHaveBeenCalledWith('Hello');
    expect(inputElement.value).toBe('');
});

test('calls handleTyping with true on input change', () => {
    const handleTyping = jest.fn();
    render(<MessageInput sendMessage={jest.fn()} handleTyping={handleTyping} />);
    fireEvent.change(screen.getByPlaceholderText(/Enter your message/i), { target: { value: 'Hello' } });
    expect(handleTyping).toHaveBeenCalledWith(true);
});

test('calls handleTyping with false on input blur', () => {
    const handleTyping = jest.fn();
    render(<MessageInput sendMessage={jest.fn()} handleTyping={handleTyping} />);
    fireEvent.blur(screen.getByPlaceholderText(/Enter your message/i));
    expect(handleTyping).toHaveBeenCalledWith(false);
});

test('does not call sendMessage if input is empty on send button click', () => {
    const sendMessage = jest.fn();
    render(<MessageInput sendMessage={sendMessage} handleTyping={jest.fn()} />);
    fireEvent.click(screen.getByText(/Send/i));
    expect(sendMessage).not.toHaveBeenCalled();
});