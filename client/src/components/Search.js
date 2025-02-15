import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const SearchComponent = ({ func }) => {
  const [items, setResults] = useState([]);

  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await fetch(
          `https://cs5610-final-project-server.vercel.app/search?query=${query}`
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

export default SearchComponent;
