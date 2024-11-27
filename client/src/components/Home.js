import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HomeComponent = ({ func }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("http://localhost:5001/items");
        const data = await response.json();
        setItems(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchItems();
  }, []);

  return (
    <div>
      <div id="products">
        {items.map((item) => (
          <div key={item.id} className="product">
            <Link to={`/item/${item.id}`}>
              <img src={`/images/${item.id}.jpg`} alt={item.productName} />
              <h2>{item.productName}</h2>
            </Link>
            <p>{item.weight}</p>
            <p>Price: ${item.price}</p>
            <button
              className="add-to-cart"
              onClick={() => {
                func(item);
              }}
            >
              + Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeComponent;
