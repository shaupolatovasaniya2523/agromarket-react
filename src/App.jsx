import { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm.jsx';
import AddProductForm from './components/AddProductForm.jsx';
import { API_URL, apiFetch } from './api.js';

export default function App() {
  const [products, setProducts] = useState([]);

  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem('user') || 'null')
  );

  const [path, setPath] = useState(window.location.pathname);

  // Перенаправление гостя с административной страницы
  useEffect(() => {
    if (path === '/admin' && !localStorage.getItem('token')) {
      window.history.replaceState({}, '', '/login');
      setPath('/login');
    }
  }, [path]);

  // Проверка авторизации
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

  // Загрузка каталога
  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка загрузки товаров');
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
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
              <button onClick={handleLogout}>Выйти</button>
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

        <div className="products-grid">
          {products.map((p) => (
            <div
              key={p.id}
              className="product-card"
              data-testid="product-card"
            >
              <h3>{p.name}</h3>
              <p>{p.category}</p>
              <p>
                <b>{p.price} ₸</b> / {p.unit}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}