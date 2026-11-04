
import { useState } from 'react';
import { apiFetch } from '../api.js';

export default function LoginForm({
    onLogin,
    onSubmit,
    initialMode = 'login',
  }) {
  const [mode, setMode] = useState(initialMode);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const data = Object.fromEntries(
      new FormData(e.target)
    );

    if (!data.email || !data.password) {
      setError('Заполните все поля');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(data.email)) {
      setError('Некорректный e-mail');
      return;
    }

    if (data.password.length < 8) {
      setError('Пароль должен содержать минимум 8 символов');
      return;
    }

    setLoading(true);

    try {
      // Режим тестирования через onSubmit
      if (onSubmit) {
        await onSubmit(data);
        return;
      }

      // Обычная авторизация приложения
      const result = await apiFetch(`/auth/${mode}`, {
        method: 'POST',
        body: JSON.stringify(data),
      });

      onLogin?.(result.user, result.token);
    } catch (err) {
      setError(err.message || 'Ошибка авторизации');
    } finally {
      setLoading(false);
    }
  }

  const isLogin = mode === 'login';

  return (
    <form
      className="login-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <h3>{isLogin ? 'Вход' : 'Регистрация'}</h3>

      {!isLogin && (
        <input
          name="name"
          placeholder="Имя"
          aria-label="Имя"
          required
        />
      )}

      <input
        name="email"
        type="email"
        placeholder="Email"
        aria-label="E-mail"
        required
      />

      <input
        name="password"
        type="password"
        placeholder="Пароль (от 8 символов)"
        aria-label="Пароль"
        required
        minLength={8}
      />

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading}>
        {loading
          ? 'Подождите…'
          : isLogin
            ? 'Войти'
            : 'Зарегистрироваться'}
      </button>

      <button
        type="button"
        onClick={() => {
          setMode(isLogin ? 'register' : 'login');
          setError('');
        }}
      >
        {isLogin
          ? 'Нет аккаунта? Регистрация'
          : 'Уже есть аккаунт? Войти'}
      </button>
    </form>
  );
}
