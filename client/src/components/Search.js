import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const SearchComponent = () => {
  const [items, setResults] = useState([]);

  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/search?query=${query}`
        );
        setResults(await response.json());
      } catch (err) {
        console.error("Error fetching search results:", err);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div>
      <div id="products">
        {items.map((item) => (
          <div key={item.id} className="product">
            <img src={`/images/${item.id}.jpg`} alt={item.productName} />
            <h2>{item.productName}</h2>
            <p>{item.weight}</p>
            <p>Price: ${item.price}</p>
            <button className="add-to-cart">+ Add</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchComponent;
