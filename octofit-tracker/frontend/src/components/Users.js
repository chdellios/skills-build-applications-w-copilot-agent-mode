import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;
      console.log('Fetching Users from:', apiUrl);

      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Users API Response:', data);

      // Handle both paginated (.results) and plain array responses
      const usersData = data.results || data;
      setUsers(Array.isArray(usersData) ? usersData : []);
      setError(null);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message);
      setUsers([]);
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
        <p className="mt-3">Loading users...</p>
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
        <h2>Users</h2>
        <button className="btn btn-primary" onClick={fetchUsers}>
          <i className="bi bi-arrow-clockwise"></i> Refresh
        </button>
      </div>
      
      {users.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No users found
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-dark">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Username</th>
                <th scope="col">Email</th>
                <th scope="col">Name</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td><strong>{user.username}</strong></td>
                  <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                  <td>{user.first_name} {user.last_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Users;
