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

    try {
      const response = await axios.post(
        "https://site--oh-my-skin--cvtt47qfxcv8.code.run/payment",
      );

      console.log("response => ", response.data);

      // const { client_secret: clientSecret } = response.data;

      // Confirm the PaymentIntent using the details collected by the Payment Element

      // Ajoutez un paramètre return_url à cette fonction pour indiquer à Stripe où rediriger l’utilisateur une fois le paiement effectué.
      const confirmPaymentResponse = await stripe.confirmPayment({
        elements: elements,
        clientSecret: response.data.client_secret,
        confirmParams: {
          return_url: "http://localhost:5173/success",
        },
        // Bloque la redirections
        redirect: "if_required",
      });

      console.log("confirmPAymentResponse =>", confirmPaymentResponse);

      if (confirmPaymentResponse.error) {
        // This point is only reached if there's an immediate error when
        // confirming the payment. Show the error to your customer (for example, payment details incomplete)
        handleError(confirmPaymentResponse.error);
      } else if (confirmPaymentResponse.paymentIntent.status === "succeeded") {
        // Payment succeeded
        setLoading(false);
        setErrorMessage("");
        // Optionally redirect to success page or show success message
        window.location.href = "/success";
      } else if (confirmPaymentResponse.paymentIntent.status === "processing") {
        // Payment is still processing
        setErrorMessage("Payment is processing. Please wait...");
      } else {
        // Handle other statuses (requires_action, requires_payment_method, etc.)
        setErrorMessage("Unexpected payment status. Please try again.");
        setLoading(false);
      }
    } catch (error) {
      console.error("❌ Payment Error:", error);
      console.error("Error message:", error.message);
      console.error("Error response:", error.response?.data);

      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong with the payment",
      );
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
            Ta routine pour {price?.toFixed(2) || "0.00"}€
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
          {loading ? "En cours..." : "Acheter"}
        </button>
        {errorMessage && <p className="checkout-error">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default CheckoutForm;
