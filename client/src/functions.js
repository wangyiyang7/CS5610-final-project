const addItemToCart = (item) => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingItemIndex = cart.findIndex(
    (cartItem) => cartItem.id === item.id
  );

  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    item.quantity = 1;
    cart.push(item);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
};

export default addItemToCart;
