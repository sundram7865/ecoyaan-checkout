export const getMockCartData = async () => {
  return {
    cartItems: [
      {
        product_id: 101,
        product_name: "Bamboo Toothbrush (Pack of 4)",
        product_price: 299,
        quantity: 2,
        image: "https://via.placeholder.com/150",
        max_stock: 10
      },
      {
        product_id: 102,
        product_name: "Reusable Cotton Produce Bags",
        product_price: 450,
        quantity: 1,
        image: "https://via.placeholder.com/150",
        max_stock: 5
      },
    ],
    shipping_fee: 50,
    discount_applied: 0,
  };
};