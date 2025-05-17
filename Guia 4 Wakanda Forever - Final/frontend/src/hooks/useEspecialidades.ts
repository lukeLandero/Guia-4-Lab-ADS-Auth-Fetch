import { useEffect, useState } from 'react';
import API from '../services/api';
import type { Especialidad } from '../types';

export function useEspecialidades() {
  const [data, setData] = useState<Especialidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/especialidades/')
      .then(res => setData(res.data.data))
      .catch(() => setError('Error al cargar especialidades'))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}