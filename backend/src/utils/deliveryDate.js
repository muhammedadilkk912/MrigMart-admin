const calculateDeliveryDate = (fromDate, shippingDays) => {
  const deliveryDate = new Date(fromDate);
  let addedDays = 0;
  while (addedDays < shippingDays) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);
    const day = deliveryDate.getDay();
    if (day !== 0 && day !== 6) { // Skip weekends
      addedDays++;
    }
  }
  return deliveryDate;
};


module.exports=calculateDeliveryDate