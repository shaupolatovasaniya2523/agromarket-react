import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';
import { describe, test, expect, vi } from 'vitest';

describe('LoginForm', () => {
  test('отправляет введённые e-mail и пароль', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(
      screen.getByLabelText(/e-?mail|почта/i),
      'farmer@agromarket.kz'
    );

    await user.type(
      screen.getByLabelText(/пароль/i),
      'secret123'
    );

    await user.click(screen.getByRole('button', { name: /войти/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'farmer@agromarket.kz',
      password: 'secret123',
    });
  });

  test('с пустыми полями не отправляет и показывает ошибку', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<LoginForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: /войти/i }));

    expect(onSubmit).not.toHaveBeenCalled();

    expect(screen.getByText(/заполните все поля/i)).toBeInTheDocument();
  });

  test('некорректный e-mail не отправляет форму', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(
      screen.getByLabelText(/e-?mail|почта/i),
      'farmeragromarket.kz'
    );

    await user.type(
      screen.getByLabelText(/пароль/i),
      'secret123'
    );

    await user.click(screen.getByRole('button', { name: /войти/i }));

    expect(onSubmit).not.toHaveBeenCalled();

    expect(screen.getByText(/некорректный e-mail/i)).toBeInTheDocument();
  });
});