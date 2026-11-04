import { useState } from 'react';

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');

  const loadApplications = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/applications/my', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        setError('Войдите заново');
        return;
      }

      if (!response.ok) {
        throw new Error('Ошибка загрузки заявок');
      }

      const data = await response.json();
      setApplications(data);
      setError('');
    } catch {
      setError('Ошибка загрузки заявок');
    }
  };

  return (
    <div>
      <h2>Мои заявки</h2>

      <button onClick={loadApplications}>
        Загрузить заявки
      </button>

      {error && <p>{error}</p>}

      {applications.map((application) => (
        <div key={application.id}>
          {application.name}
        </div>
      ))}
    </div>
  );
}

export default MyApplications;