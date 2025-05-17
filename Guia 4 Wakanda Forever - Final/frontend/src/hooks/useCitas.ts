import { useEffect, useState } from 'react';
import API from '../services/api';

export function useCitas() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/citas/')
      .then(res => setData(res.data.data))
      .catch(() => setError('Error al cargar citas'))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}