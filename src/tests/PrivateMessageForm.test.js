import { render, screen, fireEvent } from '@testing-library/react';
import PrivateMessageForm from '../components/PrivateMessageForm';

const sendPrivateMessage = jest.fn();

it('renders input and button', () => {
    render(<PrivateMessageForm recipient="Bob" sendPrivateMessage={sendPrivateMessage} />);
    expect(screen.getByPlaceholderText('Message to Bob')).toBeInTheDocument();
    expect(screen.getByText('Send Private')).toBeInTheDocument();
});

it('sends private message on button click', () => {
    render(<PrivateMessageForm recipient="Bob" sendPrivateMessage={sendPrivateMessage} />);
    fireEvent.change(screen.getByPlaceholderText('Message to Bob'), { target: { value: 'Hello Bob' } });
    fireEvent.click(screen.getByText('Send Private'));
    expect(sendPrivateMessage).toHaveBeenCalledWith('Hello Bob');
});

it('clears input after sending message', () => {
    render(<PrivateMessageForm recipient="Bob" sendPrivateMessage={sendPrivateMessage} />);
    const input = screen.getByPlaceholderText('Message to Bob');
    fireEvent.change(input, { target: { value: 'Hello Bob' } });
    fireEvent.click(screen.getByText('Send Private'));
    expect(input.value).toBe('');
});

it('does not send empty message', () => {
    render(<PrivateMessageForm recipient="Bob" sendPrivateMessage={sendPrivateMessage} />);
    fireEvent.click(screen.getByText('Send Private'));
    expect(sendPrivateMessage).not.toHaveBeenCalled();
});