import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`;
      console.log('Fetching Workouts from:', apiUrl);

      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Workouts API Response:', data);

      // Handle both paginated (.results) and plain array responses
      const workoutsData = data.results || data;
      setWorkouts(Array.isArray(workoutsData) ? workoutsData : []);
      setError(null);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setError(error.message);
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading workouts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <strong>Error!</strong> {error}
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Workouts</h2>
        <button className="btn btn-primary" onClick={fetchWorkouts}>
          <i className="bi bi-arrow-clockwise"></i> Refresh
        </button>
      </div>
      
      {workouts.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No workouts found
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Description</th>
                <th scope="col">Duration (min)</th>
                <th scope="col">Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {workouts.map((workout) => (
                <tr key={workout.id}>
                  <td>{workout.id}</td>
                  <td><strong>{workout.name}</strong></td>
                  <td>{workout.description}</td>
                  <td>{workout.duration}</td>
                  <td>
                    <span className={`badge ${getDifficultyClass(workout.difficulty)}`}>
                      {workout.difficulty}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function getDifficultyClass(difficulty) {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return 'bg-success';
    case 'medium':
      return 'bg-warning';
    case 'hard':
      return 'bg-danger';
    default:
      return 'bg-secondary';
  }
}

export default Workouts;
