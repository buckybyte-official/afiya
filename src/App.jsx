import { useState } from "react";
import "./App.css";
import Card from "./components/card/card";
import Cart from "./components/cart/cart";
import { getData } from "./constants/db";
import { useEffect } from "react";
import { useCallback } from "react";

const products = getData();

const telegram = window.Telegram.WebApp;

const App = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    telegram.ready();
  });

  const onAddItem = (item) => {
    const existItem = cartItems.find((c) => c.id == item.id);

    if (existItem) {
      const newData = cartItems.map((c) =>
        c.id == item.id
          ? { ...existItem, quantity: existItem.quantity + 1 }
          : c,
      );
      setCartItems(newData);
    } else {
      const newData = [...cartItems, { ...item, quantity: 1 }];
      setCartItems(newData);
    }
  };

  const onRemoveItem = (item) => {
    const existItem = cartItems.find((c) => c.id == item.id);

    if (existItem.quantity === 1) {
      const newData = cartItems.filter((c) => c.id !== existItem.id);
      setCartItems(newData);
    } else {
      const newData = cartItems.map((c) =>
        c.id === existItem.id
          ? { ...existItem, quantity: existItem.quantity - 1 }
          : c,
      );
      setCartItems(newData);
    }
  };

  const onCheckout = () => {
    telegram.MainButton.text = "Sotib olish :)";
    telegram.MainButton.show();
  };

  const onSendData = useCallback(() => {
    telegram.sendData(JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const handler = () => onSendData(); // Stable reference

    telegram.onEvent("mainButtonClicked", handler);

    return () => telegram.offEvent("mainButtonClicked", handler);
  });

  return (
    <>
      <h1 className="heading"> Afiya Market</h1>
      <Cart cartItems={cartItems} onCheckout={onCheckout} />
      <div className="cards_container">
        {products.map((products) => (
          <Card
            key={products.id}
            products={products}
            onAddItem={onAddItem}
            onRemoveItem={onRemoveItem}
          />
        ))}
      </div>
    </>
  );
};

export default App;
