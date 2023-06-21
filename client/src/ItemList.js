import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ItemsList = () => {
  // State variables
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState([]);

  // Fetch items when currentPage changes
  useEffect(() => {
    fetchItems();
  }, [currentPage]);

  // Fetch items from the API
  const fetchItems = async () => {
    try {
      const response = await axios.get(`/api/items?page=${currentPage}&limit=${totalPages}`);
      setItems(response.data.items);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Failed to retrieve items:', error);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <h1>Items List</h1>
      {/* Render items */}
      {items && items.map((item) => (
        <div key={item._id}>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          <p>Price: {item.price}</p>
        </div>
      ))}
      <div>
        {/* Render page buttons */}
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            disabled={page === currentPage}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ItemsList;
