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
    return () => {
      telegram.MainButton.hide();
      telegram.MainButton.offClick();
    };
  }, []);

  const onAddItem = (item) => {
    const existItem = cartItems.find((c) => c.id === item.id);

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
    const existItem = cartItems.find((c) => c.id === item.id);

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
    telegram.MainButton.text = "Rasmiylashtirish :)";
    telegram.MainButton.show();
  };

  const onSendData = useCallback(() => {
    const queryID = telegram.initDataUnsafe?.query_id;

    // Structure data properly with products array
    const orderData = {
      products: cartItems.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      })),
      query_id: queryID,
    };

    if (queryID) {
      fetch("http://localhost:8000/web-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
    } else {
      telegram.sendData(JSON.stringify(orderData));
    }
  }, [cartItems, telegram]);

  useEffect(() => {
    telegram.onEvent("mainButtonClicked", onSendData);

    return () => telegram.offEvent("mainButtonClicked", onSendData);
  }, [onSendData]);

  return (
    <>
      <h1 className="heading"> Afiya Market</h1>
      <Cart cartItems={cartItems} onCheckout={onCheckout} />
      <div className="cards_container">
        {products.map((product) => (
          <Card
            key={product.id}
            product={product} // Singular prop name
            onAddItem={onAddItem}
            onRemoveItem={onRemoveItem}
          />
        ))}
      </div>
    </>
  );
};

export default App;
