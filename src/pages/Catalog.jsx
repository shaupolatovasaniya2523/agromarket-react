import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';

export default function Catalog({ onAdd }) {
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

        setProducts(
          Array.isArray(data) ? data : data.products || []
        );
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
          <ProductCard
            key={product.id}
            product={product}
            onAdd={onAdd}
          />
        ))}
      </div>
    </section>
  );
}