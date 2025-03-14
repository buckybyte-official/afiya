import "./card.css";
import Button from "../button/button.jsx";
import { useState } from "react";

const Card = (props) => {
  const [count, setCount] = useState(0);
  const { product, onAddItem, onRemoveItem } = props; // Changed prop name to singular

  const handleIncrement = () => {
    setCount((prev) => prev + 1);
    onAddItem(product); // Pass the single product object
  };

  const handleDecrement = () => {
    setCount((prev) => prev - 1);
    onRemoveItem(product); // Pass the single product object
  };

  return (
    <div className="card">
      <span className={`${count !== 0 ? "card__badge" : "card__badge-hidden"}`}>
        {count}
      </span>

      <div className="image__container">
        <img src={product.image} alt={product.title} />
      </div>
      <div className="card__body">
        <h2 className="card__title">{product.title}</h2>
        <div className="card__price">
          {product.price.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}{" "}
          so'm
        </div>
      </div>
      <div className="hr"> </div>

      <div className="btn__container">
        <Button title={"+"} onClick={handleIncrement} type={"add"} />
        {count !== 0 && (
          <Button title={"-"} onClick={handleDecrement} type={"remove"} />
        )}
      </div>
    </div>
  );
};

export default Card;
