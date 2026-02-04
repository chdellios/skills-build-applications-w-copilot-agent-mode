import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`;
      console.log('Fetching Activities from:', apiUrl);

      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Activities API Response:', data);

      // Handle both paginated (.results) and plain array responses
      const activitiesData = data.results || data;
      setActivities(Array.isArray(activitiesData) ? activitiesData : []);
      setError(null);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setError(error.message);
      setActivities([]);
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
        <p className="mt-3">Loading activities...</p>
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
        <h2>Activities</h2>
        <button className="btn btn-primary" onClick={fetchActivities}>
          <i className="bi bi-arrow-clockwise"></i> Refresh
        </button>
      </div>
      
      {activities.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No activities found
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">User</th>
                <th scope="col">Activity Type</th>
                <th scope="col">Duration (min)</th>
                <th scope="col">Calories</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id}>
                  <td>{activity.id}</td>
                  <td><strong>{activity.user}</strong></td>
                  <td><span className="badge bg-info">{activity.activity_type}</span></td>
                  <td>{activity.duration}</td>
                  <td><span className="badge bg-success">{activity.calories_burned}</span></td>
                  <td>{new Date(activity.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Activities;
