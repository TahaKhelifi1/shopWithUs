'use client';

import { useRouter } from 'next/navigation';
import { IconCircleCheck, IconArrowRight } from '@tabler/icons-react';

export default function PaymentSuccess() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-16">
      <div className="bg-white shadow-md rounded-lg p-8">
        <div className="flex flex-col items-center space-y-8">
          <div className="flex items-center justify-center bg-green-500 p-4 rounded-full">
            <IconCircleCheck size={45} className="text-white" />
          </div>

          <h1 className="text-3xl font-semibold text-green-500 text-center">
            Thank You for Your Purchase!
          </h1>

          <p className="text-lg text-gray-600 text-center">
            We're thrilled to confirm your order has been successfully placed.
            Your support means a lot to us!
          </p>

          <div className="border p-4 rounded-md bg-gray-50">
            <p className="text-center text-gray-700">
              Your order confirmation and tracking details have been sent to your email.
            </p>
          </div>

          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={() => router.push('/product')}
              className="border border-gray-300 px-6 py-2 rounded-md flex items-center space-x-2 text-gray-800 hover:bg-gray-100"
            >
              <span>Continue Shopping</span>
              <IconArrowRight size={18} />
            </button>

            <button
              onClick={() => router.push('/order')}
              className="bg-gray-200 px-6 py-2 rounded-md text-gray-800 hover:bg-gray-300"
            >
              View Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
