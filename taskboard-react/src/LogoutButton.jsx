import { useState } from 'react';
import { logout } from './api';

export default function LogoutButton({ onLogout }) {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      localStorage.removeItem('token');
      onLogout();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleLogout} disabled={loading} className="logout-btn">
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  );
}