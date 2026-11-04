import { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm.jsx';
import AddProductForm from './components/AddProductForm.jsx';
import ProductCard from './components/ProductCard.jsx';
import { API_URL, apiFetch } from './api.js';

export default function App() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem('user') || 'null')
  );
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    if (path === '/admin' && !localStorage.getItem('token')) {
      window.history.replaceState({}, '', '/login');
      setPath('/login');
    }
  }, [path]);

  useEffect(() => {
    if (!localStorage.getItem('token')) return;

    apiFetch('/auth/me')
      .then((userData) => {
        setUser(userData);
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      });
  }, []);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch(`${API_URL}/products`);

        if (!response.ok) {
          throw new Error(`Ошибка API: ${response.status}`);
        }

        const data = await response.json();

        setProducts(
          Array.isArray(data) ? data : data.products || []
        );
      } catch (err) {
        console.error('Ошибка загрузки каталога:', err);
      }
    }

    loadProducts();
  }, []);

  function handleLogin(loggedInUser, token) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);

    window.history.pushState({}, '', '/login');
    setPath('/login');
  }

  return (
    <div className="container">
      <header>
        <h1>АгроМаркет</h1>

        <div className="auth-bar">
          {user ? (
            <>
              <span>
                Вы вошли как <b>{user.name}</b> ({user.role})
              </span>

              <button onClick={handleLogout}>
                Выйти
              </button>
            </>
          ) : (
            <LoginForm
              key={path}
              initialMode={path === '/register' ? 'register' : 'login'}
              onLogin={handleLogin}
            />
          )}
        </div>
      </header>

      <main>
        {user?.role === 'admin' && (
          <AddProductForm
            onAdded={(newProduct) =>
              setProducts((prev) => [...prev, newProduct])
            }
          />
        )}

        <h2>Каталог товаров</h2>

        {products.length === 0 ? (
          <p>Товаров пока нет или каталог не загрузился.</p>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={(item) => {
                  console.log('Товар выбран:', item);
                }}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}