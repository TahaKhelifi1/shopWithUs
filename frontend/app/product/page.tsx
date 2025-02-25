"use client";

import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import {
  Card,
  Grid,
  Badge,
  Group,
  Button,
  TextInput,
  Loader,
} from "@mantine/core";

const ALL_PRODUCTS = gql`
  query ListProduct {
    listProduct {
      id
      name
      price
      description
      stock
      category
      imageUrl
    }
  }
`;

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  category: string;
  imageUrl: string;
}

interface ListProductData {
  listProduct: Product[];
}

export default function Product() {
  const { loading, error, data } = useQuery<ListProductData>(ALL_PRODUCTS, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const router = useRouter();
  const [productList, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (data?.listProduct) {
      setProducts(data.listProduct);
    }
  }, [data]);

  useEffect(() => {
    if (data?.listProduct) {
      const filtered = data.listProduct.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setProducts(filtered);
    }
  }, [searchQuery, data]);

  const handleQuantityChange = (productId: string, value: string) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: parseInt(value)
    }));
  };

  const addToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1;
    
    // Get existing cart items from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already exists in cart
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id);
    
    if (existingItemIndex !== -1) {
      // Update quantity if product exists
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      // Add new product to cart
      existingCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        total: product.price * quantity
      });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    showNotification({
      title: 'Added to Cart',
      message: `${quantity} x ${product.name} added to your cart`,
      color: 'green'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg">
          Error: {error.message}
          {error.networkError
            ? " - Please check if your GraphQL server is running."
            : ""}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-[#ffffff] rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-[#fbbf24] text-3xl font-bold mb-6">Products</h1>
        <TextInput
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md mb-6 text-black"
        />

        <Grid gutter="lg">
          {productList.map((product) => (
            <Grid.Col
              key={product.id}
              span={{ base: 12, sm: 6, md: 4, lg: 3 }}
            >
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                className="hover:shadow-lg transition-shadow duration-200 bg-gray-800"
              >
                <Card.Section className="bg-gray-700 h-48 flex items-center justify-center overflow-hidden">
                  <img src={product.imageUrl} alt={product.name} className="h-full w-full object-fill" />
                </Card.Section>

                <Group justify="space-between" mt="md" mb="xs">
                  <p className="font-semibold text-lg text-[#fbbf24]">
                    {product.name}
                  </p>
                  <Badge color="yellow" variant="filled" size="lg">
                    ${product.price.toFixed(2)}
                  </Badge>
                </Group>

                <p
                  className="text-sm text-gray-400 line-clamp-2 min-h-[40px]"
                  title={product.description}
                >
                  {product.description}
                </p>

                <Group justify="space-between" mt="md">
                  <Badge
                    color={product.stock > 0 ? "green" : "red"}
                    variant="light"
                  >
                    {product.stock > 0
                      ? `In Stock (${product.stock})`
                      : "Out of Stock"}
                  </Badge>
                  <p className="text-sm text-gray-500">{product.category}</p>
                </Group>

                <Group mt="md" grow>
                  <select
                    value={quantities[product.id] || 1}
                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                    disabled={product.stock === 0}
                    className="bg-gray-700 text-white rounded-md py-2 px-2 text-sm "
                    aria-label="Select quantity"
                  >
                    {[...Array(Math.min(10, product.stock || 0))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <Button
                    radius="md"
                    disabled={product.stock === 0}
                    className="bg-[#616162] hover:bg-[#fbbf24] text-white transition-colors duration-200"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </Group>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </div>
    </div>
  );
}
