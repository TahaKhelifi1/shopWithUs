'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconShoppingCart, IconCheck } from '@tabler/icons-react';
import { useCart } from '@/hooks/useCart';
import { gql, useMutation } from '@apollo/client';
 // Adjust the import path as needed

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}
const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder($input: OrderInput!) {
    createOrder(input: $input) {
      id
      userId 
      productsId 
      quantity
      totalPrice
      status
    }
  }
`;

export default function OrderPage() {
  const router = useRouter();
  const [modifyModalOpen, setModifyModalOpen] = useState(false);
  const { cartItems, loading } = useCart();
  const [createOrder] = useMutation(CREATE_ORDER_MUTATION);

  const calculateTotal = (items: Product[]) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleModifyCart = () => {
    router.push('/cart');
  };

  const handleProceedToPayment = async () => {
    const userId = localStorage.getItem('userId'); // Assuming you store the user ID in local storage

    // Prepare the order input for each item in the cart
    const orders = cartItems.map((item) => ({
      userId,
      productsId: item.id,
      quantity: item.quantity,
      totalPrice: item.price * item.quantity,
      status: 'pending', // Default status
    }));

    try {
      // Call the createOrder mutation for each item in the cart
      const results = await Promise.all(
        orders.map((order) =>
          createOrder({
            variables: { input: order },
          })
        )
      );

      console.log('Orders created:', results);

      // Redirect to the success page
      router.push('/order/success');
    } catch (error) {
      console.error('Error creating orders:', error);
      // Handle error (e.g., show a notification to the user)
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-16 text-center">
        Loading order details...
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="container mx-auto py-16 text-center">
        <p className="mb-4">Your cart is empty</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={() => router.push('/product')}
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16">
      <div className="bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-8">Order Review</h2>

        {/* Order Items */}
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="border p-4 rounded-lg">
              <div className="flex justify-between">
                <div className="flex space-x-4">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md "
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="border-t mt-8 pt-4">
          <div className="flex justify-between">
            <p>Subtotal:</p>
            <p className="font-medium">${calculateTotal(cartItems).toFixed(2)}</p>
          </div>
          <div className="flex justify-between mt-2">
            <p>Shipping:</p>
            <p className="font-medium">$10.00</p>
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between">
            <p className="text-lg font-semibold">Total:</p>
            <p className="text-lg font-semibold">${(calculateTotal(cartItems) + 10).toFixed(2)}</p>
          </div>
        </div>

        {/* Modify Cart Question */}
        <div className="border-t mt-8 pt-4">
          <p className="text-center mb-4">Would you like to modify your cart before proceeding?</p>
          <div className="flex justify-center space-x-4">
            <button
              className="border border-gray-300 px-4 py-2 rounded-md flex items-center space-x-2"
              onClick={() => setModifyModalOpen(true)}
            >
              <IconShoppingCart size={20} />
              <span>Modify Cart</span>
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center space-x-2"
              onClick={handleProceedToPayment}
            >
              <IconCheck size={20} />
              <span>Proceed to Payment</span>
            </button>
          </div>
        </div>

        {/* Modify Cart Modal */}
        {modifyModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-80">
              <h3 className="text-xl font-semibold mb-4">Modify Cart Options</h3>
              <div className="space-y-4">
                <button
                  className="w-full text-left px-4 py-2 border rounded-md"
                  onClick={handleModifyCart}
                >
                  Edit Cart Contents
                </button>
                <button
                  className="w-full text-left px-4 py-2 border rounded-md"
                  onClick={() => router.push('/product')}
                >
                  Add More Products
                </button>
              </div>
              <button
                className="w-full mt-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                onClick={() => setModifyModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}