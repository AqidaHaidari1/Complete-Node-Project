import axios from "axios";
import { showAlert } from "./alert";

const stripe = Stripe(
  "pk_test_51RJsuQI7WqiqaOpBLF7bu9CakFoUwT22wEwXIYMQQPQtrr2Q5ZzlRFdERf6Jx0xdZx8kf4dX4075x4jCPkCPPliG00xiPxHbKH",
);

export const bookTour = async (tourId) => {
  try { 
 const session = await axios(
   `/api/v1/booking/checkout-sessions/${tourId}`,
 );
    
   await stripe.redirectToCheckout({
     sessionId: session.data.session.id,
   });

  } catch (err) {
    console.log(err)
    showAlert('error', err)
  }
   
}