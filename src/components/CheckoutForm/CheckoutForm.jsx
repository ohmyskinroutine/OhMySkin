import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./CheckoutForm.css";

const CheckoutForm = ({ price }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleError = (error) => {
    setLoading(false);
    setErrorMessage(error.message);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setLoading(true);

    const elementResponse = await elements.submit();

    if (elementResponse.error) {
      handleError(elementResponse.error);
      return;
    }

    const response = await axios.post("http://localhost:3000/payment");

    console.log("response => ", response.data);

    // const { client_secret: clientSecret } = response.data;

    // Confirm the PaymentIntent using the details collected by the Payment Element

    // Ajoutez un paramètre return_url à cette fonction pour indiquer à Stripe où rediriger l’utilisateur une fois le paiement effectué.
    const confirmPaymentResponse = await stripe.confirmPayment({
      elements: elements,
      clientSecret: response.data.client_secret,
      confirmParams: {
        return_url: "http://localhost:5173/",
      },
      // Bloque la redirections
      redirect: "if_required",
    });

    console.log("confirmPAymentResponse =>", confirmPaymentResponse);

    if (confirmPaymentResponse.error) {
      // This point is only reached if there's an immediate error when
      // confirming the payment. Show the error to your customer (for example, payment details incomplete)
      handleError(confirmPaymentResponse.error);
    } else {
      // Your customer is redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer is redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <Link to="/formulaire" className="checkout-back-btn">
          ←
        </Link>
        <div className="checkout-header-center">
          <h1 className="checkout-title">Méthode de paiement</h1>
          <p className="checkout-price">
            You have to pay €{price?.toFixed(2) || "0.00"}
          </p>
        </div>
        <div style={{ width: "32px" }}></div>
      </div>

      <form onSubmit={handleSubmit} className="checkout-form">
        <PaymentElement />
        <button
          className="checkout-pay-btn"
          disabled={!stripe || loading}
          type="submit"
        >
          {loading ? "Processing..." : "Acheter"}
        </button>
        {errorMessage && <p className="checkout-error">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default CheckoutForm;
