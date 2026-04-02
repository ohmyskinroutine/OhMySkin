import "./Payment.css";
// import Cookies from "js-cookie";
// import { Navigate, useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../../components/CheckoutForm/CheckoutForm";

const stripePromise = loadStripe(
  "pk_test_51SrHhAA5FAC9u5roBiShyLADcjs0tXX6WSzd2caJ4RNq4uwshKMp8kV7OFtTFG1Wo9DjsrvzDyd34oYW7Zag7EUS00K9qZ4cJU",
);

const Payment = () => {
  //   const location = useLocation();
  //   //   console.log(location.state); // { price : 28, title: "Jersey cuello romantico Springfield"}
  // Fixed price of 42€ for all products
  const price = 42;
  const title = "Product";

  // const token = Cookies.get("userToken");

  const options = {
    // Type de transaction
    mode: "payment",
    // Montant de la transaction en centimes !!!!
    amount: Math.round(price * 100),
    // How can I state that price for evey single item is 42€ ? //

    // Devise de la transaction
    currency: "eur",
    // On peut customiser l'apparence ici
    appearance: {
      /*...*/
    },
  };

  return (
    <main className="payment">
      <div className="payment-container">
        <aside className="payment-left">
          <section className="payment-summary">
            <div className="summary-item">
              <span className="label">You have to pay</span>
              <span className="amount">${price.toFixed(2)}</span>
            </div>
          </section>
        </aside>

        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm title={title} price={price} />
        </Elements>
      </div>
    </main>
  );
};

export default Payment;
