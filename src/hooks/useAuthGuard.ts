import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function useAuthGuard(requireAuth: boolean = true) {
  const { user, loading, initialized } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!initialized || loading) return;

    if (requireAuth && !user) {
      navigate('/login', { replace: true });
    } else if (!requireAuth && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, initialized, requireAuth, navigate]);

  return { user, loading, initialized };
}
