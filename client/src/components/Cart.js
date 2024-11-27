import React, { useState, useEffect } from "react";

function CartComponent() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const plus = (id) => {
    const newCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const minus = (id) => {
    const newCart = cart
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const deleteItem = async (id) => {
    const newCart = cart.filter((item) => item.id !== id);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    try {
      const orderNumber = Date.now();
      const accountId = localStorage.getItem("accountId");
      const total = calculateSubtotal();
      const orderData = {
        total,
        items: cart,
      };
      const response = await fetch(
        `https://cs5610-final-project-server.vercel.app/order/${accountId}/${orderNumber}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      if (response.ok) {
        alert("Order placed successfully!");

        setCart([]);
        localStorage.removeItem("cart");
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="cart-container">
      <div id="cart-box">
        <h1 id="">Cart</h1>
        <div className="cart-details">
          <div className="cart-left">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img
                    src={`/images/${item.id}.jpg`}
                    alt={item.productName}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <h3 className="cart-item-name">{item.productName}</h3>
                    <p className="cart-item-price">${item.price}</p>
                    <div className="cart-item-controls">
                      <button onClick={() => minus(item.id)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => plus(item.id)}>+</button>
                      <button onClick={() => deleteItem(item.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p id="empty-cart">Cart is empty...</p>
            )}
          </div>
          {cart.length > 0 && (
            <div className="cart-right">
              <h3>Subtotal: ${calculateSubtotal().toFixed(2)}</h3>
              <div id="checkout">
                <button onClick={handleCheckout}>Proceed to checkout</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CartComponent;
