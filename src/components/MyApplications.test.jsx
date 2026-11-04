import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, afterEach, describe, test, expect, vi } from 'vitest';

import MyApplications from './MyApplications';

describe('MyApplications JWT tests', () => {
  let fetchSpy;

  beforeEach(() => {
    localStorage.setItem('token', 'test-token');

    fetchSpy = vi.spyOn(globalThis, 'fetch');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  test('отправляет JWT-токен в заголовке Authorization', async () => {
    fetchSpy.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [],
    });

    const user = userEvent.setup();

    render(<MyApplications />);

    await user.click(
      screen.getByRole('button', { name: /загрузить заявки/i })
    );

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalled();
    });

    const [, options] = fetchSpy.mock.calls[0];

    expect(options.headers.Authorization).toBe('Bearer test-token');
  });

  test('показывает сообщение при ответе сервера 401', async () => {
    fetchSpy.mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({}),
    });

    const user = userEvent.setup();

    render(<MyApplications />);

    await user.click(
      screen.getByRole('button', { name: /загрузить заявки/i })
    );

    expect(
      await screen.findByText('Войдите заново')
    ).toBeInTheDocument();
  });
});