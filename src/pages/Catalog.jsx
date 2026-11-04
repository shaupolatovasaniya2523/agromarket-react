
import { useEffect, useState } from 'react';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError('');

        const response = await fetch('/api/products');

        if (!response.ok) {
          throw new Error('Ошибка загрузки');
        }

        const data = await response.json();

        setProducts(data);
      } catch (err) {
        setError('Не удалось загрузить товары');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading) {
    return <p>Загрузка товаров...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (products.length === 0) {
    return <p>Товаров пока нет</p>;
  }

  return (
    <section>
      <h2>Каталог товаров</h2>

      <div className="products-grid">
        {products.map((product) => (
          <article key={product.id} className="card">
            <h3>{product.name}</h3>
            <p>{product.category}</p>
            <p>{product.price} тг</p>
          </article>
        ))}
      </div>
    </section>
  );
}
