import { render, screen, fireEvent } from '@testing-library/react';
import Chat from '../components/Chat';

const messages = [
    { id: 1, sender: 'Alice', content: 'Hello', type: 'PUBLIC', readReceipt: null },
    { id: 2, sender: 'Bob', content: 'Hi', type: 'PRIVATE', readReceipt: null },
    { id: 3, sender: 'System', content: 'Welcome', type: 'SYSTEM', readReceipt: null },
];

const sendReadReceipt = jest.fn();

it('renders all messages', () => {
    render(<Chat messages={messages} username="Alice" sendReadReceipt={sendReadReceipt} />);
    expect(screen.getByText('Alice: Hello')).toBeInTheDocument();
    expect(screen.getByText('(Private) Bob: Hi')).toBeInTheDocument();
    expect(screen.getByText('System: Welcome')).toBeInTheDocument();
});

it('sends read receipt for visible messages on click', () => {
    render(<Chat messages={messages} username="Alice" sendReadReceipt={sendReadReceipt} />);
    fireEvent.click(window);
    expect(sendReadReceipt).toHaveBeenCalledWith(1, 'Alice');
    expect(sendReadReceipt).toHaveBeenCalledWith(2, 'Bob');
});

it('does not send read receipt for already read messages', () => {
    const readMessages = [
        { id: 1, sender: 'Alice', content: 'Hello', type: 'PUBLIC', readReceipt: { recipient: 'Alice', timestamp: Date.now() } },
        { id: 2, sender: 'Bob', content: 'Hi', type: 'PRIVATE', readReceipt: { recipient: 'Bob', timestamp: Date.now() } },
    ];
    render(<Chat messages={readMessages} username="Alice" sendReadReceipt={sendReadReceipt} />);
    fireEvent.click(window);
    expect(sendReadReceipt).not.toHaveBeenCalled();
});

it('does not send read receipt for messages not in view', () => {
    const hiddenMessages = [
        { id: 1, sender: 'Alice', content: 'Hello', type: 'PUBLIC', readReceipt: null },
        { id: 2, sender: 'Bob', content: 'Hi', type: 'PRIVATE', readReceipt: null },
    ];
    render(<Chat messages={hiddenMessages} username="Alice" sendReadReceipt={sendReadReceipt} />);
    const messageElement = screen.getByText('Alice: Hello');
    messageElement.getBoundingClientRect = jest.fn(() => ({ top: window.innerHeight + 1, bottom: window.innerHeight + 2 }));
    fireEvent.click(window);
    expect(sendReadReceipt).not.toHaveBeenCalled();
});