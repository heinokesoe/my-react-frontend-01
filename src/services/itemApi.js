const API_BASE_URL = 'http://localhost:3000/api/item';

/**
 * Fetch all items from the backend
 * @returns {Promise<Array>} Array of items
 */
export const fetchItems = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch items: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

/**
 * Create a new item
 * @param {Object} itemData - Item data {name, category, price}
 * @returns {Promise<Object>} Created item ID
 */
export const createItem = async (itemData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create item');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
};

/**
 * Update an existing item
 * @param {string} id - Item ID
 * @param {Object} itemData - Updated item data
 * @returns {Promise<Object>} Update result
 */
export const updateItem = async (id, itemData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(itemData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update item');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
};

/**
 * Delete an item
 * @param {string} id - Item ID
 * @returns {Promise<Object>} Delete result
 */
export const deleteItem = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete item');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};
