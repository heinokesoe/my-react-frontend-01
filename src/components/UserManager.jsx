import { useState, useEffect } from 'react';
import { fetchUsers, createUser, updateUser, deleteUser } from '../services/userApi';
import './ItemManager.css'; // Reusing the same CSS for consistency

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        firstname: '',
        lastname: '',
        password: '',
        status: 'ACTIVE'
    });

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const loadUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchUsers();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (editingUser) {
                // Remove password from update if user didn't enter one (though backend PATCH doesn't support password update yet)
                const { password, ...updateData } = formData;

                // Remove password if empty to avoid sending empty string
                if (!password) delete updateData.password;

                await updateUser(editingUser._id, updateData);
                setSuccessMessage('User updated successfully!');
                setEditingUser(null);
            } else {
                await createUser(formData);
                setSuccessMessage('User created successfully!');
            }

            setFormData({ username: '', email: '', firstname: '', lastname: '', password: '', status: 'ACTIVE' });
            await loadUsers();
            setCurrentPage(1);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            firstname: user.firstname || '',
            lastname: user.lastname || '',
            password: '', // Don't show existing password
            status: user.status || 'ACTIVE'
        });
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
        setFormData({ username: '', email: '', firstname: '', lastname: '', password: '', status: 'ACTIVE' });
    };

    const handleDelete = async (user) => {
        if (!window.confirm(`Delete user "${user.username}"?`)) return;

        setLoading(true);
        setError(null);

        try {
            await deleteUser(user._id);
            setSuccessMessage('User deleted successfully!');
            await loadUsers();

            const newTotalPages = Math.ceil((users.length - 1) / itemsPerPage);
            if (currentPage > newTotalPages && newTotalPages > 0) {
                setCurrentPage(newTotalPages);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const reversedUsers = [...users].reverse(); // Show newest first
    const currentUsers = reversedUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(users.length / itemsPerPage);

    return (
        <div className="item-manager">
            <div className="container">
                <h1>User Management</h1>

                {error && (
                    <div className="message error">
                        {error}
                        <button onClick={() => setError(null)}>×</button>
                    </div>
                )}

                {successMessage && (
                    <div className="message success">{successMessage}</div>
                )}

                <div className="form-card">
                    <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
                    <form onSubmit={handleFormSubmit}>
                        <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr auto' }}>
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleFormChange}
                                    required
                                    placeholder="Username"
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleFormChange}
                                    required
                                    placeholder="Email"
                                />
                            </div>

                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    name="firstname"
                                    value={formData.firstname}
                                    onChange={handleFormChange}
                                    required
                                    placeholder="First Name"
                                />
                            </div>

                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    name="lastname"
                                    value={formData.lastname}
                                    onChange={handleFormChange}
                                    required
                                    placeholder="Last Name"
                                />
                            </div>

                            {!editingUser && (
                                <div className="form-group">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleFormChange}
                                        required
                                        placeholder="Password"
                                    />
                                </div>
                            )}

                            {editingUser && (
                                <div className="form-group">
                                    <label>Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleFormChange}
                                        style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }}
                                    >
                                        <option value="ACTIVE">ACTIVE</option>
                                        <option value="INACTIVE">INACTIVE</option>
                                    </select>
                                </div>
                            )}

                            <div className="form-actions">
                                {editingUser && (
                                    <button type="button" className="btn btn-cancel" onClick={handleCancelEdit}>
                                        Cancel
                                    </button>
                                )}
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {editingUser ? 'Update' : 'Add User'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {loading && <div className="loading">Wait...</div>}

                {!loading && users.length > 0 && (
                    <>
                        <table className="items-table">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentUsers.map((user) => (
                                    <tr key={user._id}>
                                        <td>{user.username}</td>
                                        <td>{user.firstname} {user.lastname}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className="status-badge" style={{
                                                backgroundColor: user.status === 'ACTIVE' ? '#28a745' : '#dc3545'
                                            }}>
                                                {user.status || 'ACTIVE'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-edit"
                                                onClick={() => handleEdit(user)}
                                                disabled={loading}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-delete"
                                                onClick={() => handleDelete(user)}
                                                disabled={loading}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="pagination">
                            <div className="pagination-info">
                                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, users.length)} of {users.length} users
                            </div>

                            <div className="pagination-controls">
                                <label>
                                    Users per page:
                                    <select value={itemsPerPage} onChange={(e) => {
                                        setItemsPerPage(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}>
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                    </select>
                                </label>

                                <button
                                    className="btn"
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>

                                <span>Page {currentPage} of {totalPages}</span>

                                <button
                                    className="btn"
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {!loading && users.length === 0 && (
                    <div className="empty-state">
                        <p>No users found. Add your first user using the form above.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManager;
