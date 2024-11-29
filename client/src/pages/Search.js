import SearchComponent from "../components/Search.js";
import addItemToCart from "../functions.js";

const Search = () => {
  return (
    <div>
      <SearchComponent func={addItemToCart} />
    </div>
  );
};

export default Search;
