import ItemComponent from "../components/Item.js";
import addItemToCart from "../functions.js";

const Item = () => {
  return (
    <div>
      <ItemComponent addToCart={addItemToCart} />
    </div>
  );
};

export default Item;
