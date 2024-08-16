import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import Chat from './components/Chat';

jest.mock('@stomp/stompjs', () => ({
  Client: jest.fn().mockImplementation(() => ({
    activate: jest.fn(),
    publish: jest.fn(),
    subscribe: jest.fn(),
  })),
}));

test('renders WebSocket Chat title', () => {
  render(<App />);
  const titleElement = screen.getByText(/WebSocket Chat/i);
  expect(titleElement).toBeInTheDocument();
});

test('connects to WebSocket on Connect button click', () => {
  render(<App />);
  const inputElement = screen.getByPlaceholderText(/Enter your name/i);
  fireEvent.change(inputElement, { target: { value: 'testuser' } });
  const buttonElements = screen.getAllByText(/Connect/i);
  fireEvent.click(buttonElements[0]);
  expect(screen.getByText(/WebSocket Chat/i)).toBeInTheDocument();
});

test('sends read receipt on window click', () => {
  const sendReadReceipt = jest.fn();
  const messages = [{ id: 1, sender: 'user1', content: 'Hello', readReceipt: null }];
  render(<Chat messages={messages} username="testuser" sendReadReceipt={sendReadReceipt} />);
  fireEvent.click(window);
  expect(sendReadReceipt).toHaveBeenCalledWith(1, "user1");
});

test('does not send read receipt if message already has one', () => {
  const sendReadReceipt = jest.fn();
  const messages = [{ id: 1, sender: 'user1', content: 'Hello', readReceipt: { recipient: 'testuser', timestamp: '2023-10-01T12:00:00Z' } }];
  render(<Chat messages={messages} username="testuser" sendReadReceipt={sendReadReceipt} />);
  fireEvent.click(window);
  expect(sendReadReceipt).not.toHaveBeenCalled();
});

test('displays read receipt information correctly', () => {
  const messages = [{ id: 1, sender: 'user1', content: 'Hello', readReceipt: { recipient: 'testuser', timestamp: '2023-10-01T12:00:00Z' } }];
  render(<Chat messages={messages} username="testuser" sendReadReceipt={jest.fn()} />);
  const readReceiptElement = screen.getByText(/Read by testuser at/i);
  expect(readReceiptElement).toBeInTheDocument();
});