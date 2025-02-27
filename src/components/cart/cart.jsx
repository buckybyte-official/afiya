import "./cart.css";
import Button from "../button/button.jsx";
import { totalPrice } from "../../../units/total-price.js";

const Cart = ({ cartItems, onCheckout }) => {
  return (
    <div className="cart__container">
      <p>
        Umumiy narx:{" "}
        {totalPrice(cartItems).toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}{" "}
        so'm
      </p>
      <Button
        title={`${cartItems.length === 0 ? "Buyurtma berish" : "To'lov"}`}
        disable={cartItems.length === 0 ? true : false}
        type={"checkout"}
        onClick={onCheckout}
      />
    </div>
  );
};

export default Cart;
