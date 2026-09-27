const API_BASE = 'http://127.0.0.1:8000/api';

function getToken() {
  return localStorage.getItem('token');
}

function api(path, options = {}) {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  }).then(async (res) => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw { status: res.status, data };
    }
    return data;
  });
}

export function login(email, password) {
  return api('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function register(name, email, password, password_confirmation) {
  return api('/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, password_confirmation }),
  });
}

export function logout() {
  return api('/logout', { method: 'POST' });
}

export function getProjects() {
  return api('/projects');
}

export function createProject(name, description = '') {
  return api('/projects', {
    method: 'POST',
    body: JSON.stringify({ name, description }),
  });
}

export function getProject(id) {
  return api(`/projects/${id}`);
}

export function createTask(projectId, title, due_date = null) {
  return api(`/projects/${projectId}/tasks`, {
    method: 'POST',
    body: JSON.stringify({ title, due_date }),
  });
}