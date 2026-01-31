import { useState, useEffect } from 'react';
import { fetchItems, createItem, updateItem, deleteItem } from '../services/itemApi';
import './ItemManager.css';

const ItemManager = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: ''
    });

    useEffect(() => {
        loadItems();
    }, []);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const loadItems = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchItems();
            setItems(data);
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
            if (editingItem) {
                await updateItem(editingItem._id, formData);
                setSuccessMessage('Item updated successfully!');
                setEditingItem(null);
            } else {
                await createItem(formData);
                setSuccessMessage('Item created successfully!');
            }

            setFormData({ name: '', category: '', price: '' });
            await loadItems();
            setCurrentPage(1);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            name: item.itemName,
            category: item.itemCategory,
            price: item.itemPrice
        });
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
        setFormData({ name: '', category: '', price: '' });
    };

    const handleDelete = async (item) => {
        if (!window.confirm(`Delete "${item.itemName}"?`)) return;

        setLoading(true);
        setError(null);

        try {
            await deleteItem(item._id);
            setSuccessMessage('Item deleted successfully!');
            await loadItems();

            const newTotalPages = Math.ceil((items.length - 1) / itemsPerPage);
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
    const reversedItems = [...items].reverse(); // Show newest first
    const currentItems = reversedItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(items.length / itemsPerPage);

    return (
        <div className="item-manager">
            <div className="container">
                <h1>Item Management</h1>

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
                    <h2>{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
                    <form onSubmit={handleFormSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Item Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    required
                                    placeholder="Enter item name"
                                />
                            </div>

                            <div className="form-group">
                                <label>Category</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleFormChange}
                                    required
                                    placeholder="Enter category"
                                />
                            </div>

                            <div className="form-group">
                                <label>Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleFormChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="form-actions">
                                {editingItem && (
                                    <button type="button" className="btn btn-cancel" onClick={handleCancelEdit}>
                                        Cancel
                                    </button>
                                )}
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {editingItem ? 'Update' : 'Add Item'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {loading && <div className="loading">Loading...</div>}

                {!loading && items.length > 0 && (
                    <>
                        <table className="items-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item.itemName}</td>
                                        <td>{item.itemCategory}</td>
                                        <td>${Number(item.itemPrice).toFixed(2)}</td>
                                        <td>
                                            <span className="status-badge">
                                                {item.status || 'ACTIVE'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-edit"
                                                onClick={() => handleEdit(item)}
                                                disabled={loading}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-delete"
                                                onClick={() => handleDelete(item)}
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
                                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, items.length)} of {items.length} items
                            </div>

                            <div className="pagination-controls">
                                <label>
                                    Items per page:
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

                {!loading && items.length === 0 && (
                    <div className="empty-state">
                        <p>No items found. Add your first item using the form above.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ItemManager;
