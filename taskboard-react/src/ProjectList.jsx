import { useState, useEffect } from 'react';
import { getProjects } from './api';

export default function ProjectList({ onAddProject }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data.data || []);
    } catch (err) {
      setError(err.data?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="project-list">
      <div className="projects-header">
        <h2>Projects</h2>
        <AddProjectForm onProjectAdded={loadProjects} />
      </div>
      {projects.length === 0 ? (
        <p>No projects yet. Create one above!</p>
      ) : (
        <ul>
          {projects.map((project) => (
            <li key={project.id} className="project-item">
              <strong>{project.name}</strong>
              <span className="tasks-count">({project.tasks_count || 0} tasks)</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AddProjectForm({ onProjectAdded }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { createProject } = require('./api');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setError('');
    setLoading(true);
    try {
      await createProject(name);
      setName('');
      onProjectAdded();
    } catch (err) {
      setError(err.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-project-form">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Project name"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Project'}
      </button>
      {error && <span className="error">{error}</span>}
    </form>
  );
}