import { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import ProjectList from './ProjectList';
import LogoutButton from './LogoutButton';
import './App.css';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  const handleLogin = () => {
    setToken(localStorage.getItem('token'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  if (!token) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <header>
        <h1>TaskBoard</h1>
        <LogoutButton onLogout={handleLogout} />
      </header>
      <main>
        <ProjectList />
      </main>
    </div>
  );
}

export default App;