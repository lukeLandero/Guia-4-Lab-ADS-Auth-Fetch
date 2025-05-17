import { useEffect, useState } from 'react';
import API from '../services/api';
import type { Paciente } from '../types';

export function usePacientes() {
  const [data, setData] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/pacientes/')
      .then(res => setData(res.data.data))
      .catch(() => setError('Error al cargar pacientes'))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}