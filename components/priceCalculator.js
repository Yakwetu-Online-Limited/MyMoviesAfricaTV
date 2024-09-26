// priceCalculator.js
export const calculatePrice = (movie, attendees) => {
    const basePrice = 149; // KES per attendee
    let totalPrice = 0;
  
    switch (attendees) {
      case '6-20 People':
        totalPrice = basePrice * 20;
        break;
      case '21-100 People':
        totalPrice = basePrice * 100;
        break;
      case '101-200 People':
        totalPrice = basePrice * 200;
        break;
      case '201+ People':
        totalPrice = basePrice * 250; // Assuming a cap at 250 people
        break;
      default:
        totalPrice = 0;
    }
  
    return totalPrice;
  };