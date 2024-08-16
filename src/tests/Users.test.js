import { render, screen, fireEvent } from '@testing-library/react';
import Users from '../components/Users';

it('displays all connected users', () => {
    const users = ['Alice', 'Bob', 'Charlie'];
    render(<Users users={users} setPrivateRecipient={jest.fn()} />);
    users.forEach(user => {
        expect(screen.getByText(user)).toBeInTheDocument();
    });
});

it('calls setPrivateRecipient with the correct user when a user is clicked', () => {
    const users = ['Alice', 'Bob', 'Charlie'];
    const setPrivateRecipient = jest.fn();
    render(<Users users={users} setPrivateRecipient={setPrivateRecipient} />);
    fireEvent.click(screen.getByText('Bob'));
    expect(setPrivateRecipient).toHaveBeenCalledWith('Bob');
});

it('displays no users when the users list is empty', () => {
    render(<Users users={[]} setPrivateRecipient={jest.fn()} />);
    expect(screen.getByText('Connected Users:')).toBeInTheDocument();
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
});

it('displays users with correct styles', () => {
    const users = ['Alice'];
    render(<Users users={users} setPrivateRecipient={jest.fn()} />);
    const userItem = screen.getByText('Alice');
    expect(userItem).toHaveStyle('cursor: pointer');
    expect(userItem).toHaveStyle('margin-bottom: 5px');
    expect(userItem).toHaveStyle('padding: 5px');
    expect(userItem).toHaveStyle('border: 1px solid transparent');
    expect(userItem).toHaveStyle('border-radius: 3px');
});