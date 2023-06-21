import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import ItemsList from "./ItemList";

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [editItemId, setEditItemId] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get("/api/items");
      setItems(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const addItem = async () => {
    try {
      const response = await axios.post("/api/items", {
        name,
        description,
        price,
      });
      setItems([...items, response.data]);
      setName("");
      setDescription("");
      setPrice("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const editItem = (id) => {
    setEditItemId(id);
    const item = items.find((item) => item._id === id);
    setName(item.name);
    setDescription(item.description);
    setPrice(item.price);
  };
  const cancelEdit = () => {
    setEditItemId("");
    setName("");
    setDescription("");
    setPrice("");
  };

  const handleUpdate = (e, id) => {
    e.preventDefault();
    axios
      .put(`/api/items/${id}`, { name, description, price })
      .then((response) => {
        setItems((prevItems) =>
          prevItems.map((item) => (item._id === id ? response.data : item))
        );
        cancelEdit();
      })
      .catch((error) => console.error("Error:", error));
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`/api/items/${id}`);
      setItems((prevItems) => prevItems.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="App">
      <h1>Items</h1>

      <form>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button type="button" onClick={addItem}>
          Add Item
        </button>
      </form>
      <div className="item-list">
        {items && items.map((item) => (
          <li key={item._id} id={item._id}>
            <div>
            <p>Product Name: {item.name} </p>
           
            </div>
            <div>
            <p>Product Description: {item.description}</p>
           
            </div>
            <div>
            <p>Product Price:  {item.price}</p>
           
            </div>
            {editItemId === item._id ? (
              <form onSubmit={(e) => handleUpdate(e, item._id)}>
                
                <button type="submit">Update</button>
                <button type="button" onClick={() => cancelEdit()}>
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <button className= "edit-button" onClick={() => editItem(item._id)}>Edit</button>
                <button className= "delete-button" onClick={() => deleteItem(item._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </div>
      <ItemsList/>
    </div>
  );
}

export default App;
