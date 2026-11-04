import { render, screen } from '@testing-library/react';
import Catalog from './Catalog';

const products = [
  { id: 1, name: 'Мёд гречишный', price: 3500, category: 'Мёд' },
  { id: 2, name: 'Пшеница 3 класса', price: 120, category: 'Зерно' },
];

// Имитация ответа сервера
function mockFetch(body, status = 200) {
  return vi.spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    }),
  );
}

function renderCatalog() {
  return render(<Catalog />);
}

describe('Catalog', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('сначала показывает загрузку, потом товары', async () => {
    mockFetch(products);
    renderCatalog();

    expect(screen.getByText(/загрузка/i)).toBeInTheDocument();

    expect(await screen.findByText('Мёд гречишный')).toBeInTheDocument();
    expect(screen.getByText('Пшеница 3 класса')).toBeInTheDocument();

    expect(screen.queryByText(/загрузка/i)).not.toBeInTheDocument();
  });

  test('запрашивает правильный адрес', async () => {
    const spy = mockFetch(products);

    renderCatalog();

    await screen.findByText('Мёд гречишный');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(String(spy.mock.calls[0][0])).toMatch(/\/api\/products/);
  });

  test('при ошибке сервера показывает сообщение', async () => {
    mockFetch({ error: 'Внутренняя ошибка сервера' }, 500);

    renderCatalog();

    expect(
      await screen.findByText(/не удалось загрузить товары/i)
    ).toBeInTheDocument();
  });

  test('если сервер вернул пустой массив, показывает сообщение', async () => {
    mockFetch([]);

    renderCatalog();

    expect(
      await screen.findByText(/товаров пока нет/i)
    ).toBeInTheDocument();
  });

  test('при недоступности сети показывает ошибку', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(
      new TypeError('Failed to fetch')
    );

    renderCatalog();

    expect(
      await screen.findByText(/не удалось загрузить товары/i)
    ).toBeInTheDocument();
  });
});