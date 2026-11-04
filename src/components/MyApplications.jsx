import { useState } from 'react';
import { apiFetch } from '../api.js';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadApplications() {
    setLoading(true);
    setError('');

    try {
      const data = await apiFetch('/applications/my');
      setApplications(data);
    } catch (err) {
      setError(err.message || 'Ошибка загрузки заявок');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h2>Мои заявки</h2>

      <button onClick={loadApplications} disabled={loading}>
        {loading ? 'Загрузка...' : 'Загрузить заявки'}
      </button>

      {error && <p role="alert">{error}</p>}

      {applications.length === 0 && !error && (
        <p>Заявок пока нет</p>
      )}

      {applications.map((application) => (
        <div key={application.id}>
          <p>{application.name}</p>
        </div>
      ))}
    </section>
  );
}