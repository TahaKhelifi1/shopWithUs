'use client';
import Link from 'next/link';

function LandingPage() {
  return (
    <div
      className="relative bg-cover bg-center bg-[url('https://99designs-blog.imgix.net/blog/wp-content/uploads/2020/08/Best_ecommerce_platform_jpg_5Hd3CmTD-700x410.jpg?auto=format&q=60&fit=max&w=930')] min-h-screen"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 to-black/65 z-0"></div>

      <div className="relative container mx-auto flex flex-col justify-center items-center min-h-screen text-center px-6">
        <h1 className="text-white text-5xl font-extrabold leading-[1.1] md:text-4xl md:leading-[1.2] sm:text-3xl sm:leading-[1.3]">
          Shop the Best Deals on Electronics
        </h1>
        <p className="text-white text-xl mt-6 max-w-[600px] md:max-w-full md:text-sm">
          Explore our wide range of high-quality electronics and gadgets at unbeatable prices. 
          Enjoy exclusive discounts and free shipping on select items!
        </p>
        <Link 
          href="/product" 
          className="mt-6 px-8 py-4 bg-green-500 text-white text-xl rounded-full hover:bg-green-600"
        >
          Start Shopping
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;