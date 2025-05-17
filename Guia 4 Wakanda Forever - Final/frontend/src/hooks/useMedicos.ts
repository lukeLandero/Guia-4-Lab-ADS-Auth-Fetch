import { useEffect, useState } from 'react';
import API from '../services/api';
import type { Medico } from '../types';

export function useMedicos() {
  const [data, setData] = useState<Medico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/medicos/')
      .then(res => setData(res.data.data))
      .catch(() => setError('Error al cargar médicos'))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}