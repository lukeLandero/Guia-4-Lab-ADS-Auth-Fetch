import { useEffect, useState } from 'react';
import API from '../services/api';
import type { Notificacion } from '../types';

export function useNotificaciones() {
  const [data, setData] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/notificaciones/')
      .then(res => setData(res.data.data))
      .catch(() => setError('Error al cargar notificaciones'))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}