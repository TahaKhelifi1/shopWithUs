'use client';
import { Container, Title, Card, Text, Group, Button, TextInput, Modal, Stack, NumberInput, Grid, Badge } from '@mantine/core';
import AdminGuard from '@/app/components/AdminGuard';
import AdminDashboard from '../dashboard/page';
import { useRouter } from 'next/navigation';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';
import { IconPlus, IconEdit, IconTrash, IconPackage } from '@tabler/icons-react';

const GET_ALL_PRODUCTS = gql`
  query listProduct {
    listProduct {
      id
      name
      description
      price
      stock
      category
    }
  }
`;

const ADD_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
      id
      name
      description
      price
      stock
      category
      imageUrl
    
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      description
      price
      stock
      category
      imageUrl
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation deleteProduct($id: ID!) {
    deleteProduct(id: $id){
      id
    }
  }
`;

interface ProductState {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    imageUrl: string; // Added imageUrl field
}

interface EditProductState extends ProductState {
    id: string;
}

export default function AdminProducts() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState<ProductState>({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        category: '',
        imageUrl: '', // Ensure imageUrl is initialized
    });
    const [editProduct, setEditProduct] = useState<EditProductState>({
        id: '',
        name: '',
        description: '',
        price: 0,
        stock: 0,
        category: '',
        imageUrl: '', // Ensure imageUrl is initialized
    });

    const { data, refetch } = useQuery(GET_ALL_PRODUCTS);
    
    const [createProduct] = useMutation(ADD_PRODUCT, {
        onCompleted: () => {
            refetch();
            setIsCreateModalOpen(false);
            setNewProduct({
                name: '',
                description: '',
                price: 0,
                stock: 0,
                category: '',
                imageUrl: '', // Added imageUrl field
            });
        }
    });

    const [updateProduct] = useMutation(UPDATE_PRODUCT, {
        onCompleted: () => {
            refetch();
            setIsEditModalOpen(false);
        }
    });

    const [deleteProduct] = useMutation(DELETE_PRODUCT, {
        onCompleted: () => {
            refetch();
            setIsDeleteModalOpen(false);
        }
    });

    const handleCreateProduct = async () => {
        await createProduct({
            variables: {
                input: {
                    ...newProduct,
                    price: Number(newProduct.price),
                    stock: Number(newProduct.stock),
                    imageUrl: newProduct.imageUrl // Added imageUrl field
                }
            }
        });
    };

    const handleEditProduct = async () => {
        await updateProduct({
            variables: {
                id: editProduct.id,
                input: {
                    name: editProduct.name,
                    description: editProduct.description,
                    price: Number(editProduct.price),
                    stock: Number(editProduct.stock),
                    category: editProduct.category,
                    imageUrl: editProduct.imageUrl // Added imageUrl field
                }
            }
        });
    };

    return (
        <AdminDashboard>
            <AdminGuard>
                <Container size="xl" py="xl">
                    <Group justify="space-between" mb="xl">
                        <Title>Products Management</Title>
                        <Button
                            leftSection={<IconPlus size="1.2rem" />}
                            onClick={() => setIsCreateModalOpen(true)}
                            color='yellow'
                        >
                            Add New Product
                        </Button>
                    </Group>

                    {/* Desktop View */}
                    <Grid visibleFrom="lg">
                        {data?.listProduct.map((product: any) => (
                            <Grid.Col key={product.id} span={4}>
                                <Card shadow="sm" padding="lg" radius="md" withBorder>
                                    {product.imageUrl && (
                                        <Card.Section>
                                            <img 
                                                src={product.imageUrl} 
                                                alt={product.name} 
                                                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                            />
                                        </Card.Section>
                                    )}
                                    <Group justify="space-between" mt="md" mb="md">
                                        <Text fw={600} size="25px">{product.name}</Text>
                                        <Badge variant="light">${product.price}</Badge>
                                    </Group>

                                    <Group mb="md">
                                        <Badge color="blue" variant="light">
                                            {product.category}
                                        </Badge>
                                        <div className='flex'>
                                            <IconPackage size="1.2rem" style={{ marginRight: '5px' }} /> 
                                            <Text size="sm">
                                                Stock: {product.stock} units
                                            </Text>
                                        </div>
                                    </Group>

                                    <Text size="sm" mb="xl" color="dimmed">
                                        {product.description}
                                    </Text>

                                    <Text size="xs" color="dimmed" mb="md">
                                        Last updated: {new Date(product.updatedAt).toLocaleDateString()}
                                    </Text>

                                    <div className='flex justify-end'>
                                        <Button
                                            color="red"
                                            variant="light"
                                            w={"max-content"}
                                            onClick={() => {
                                                setEditProduct({
                                                    ...editProduct,
                                                    id: product.id
                                                });
                                                setIsDeleteModalOpen(true);
                                            }}
                                        >
                                            <IconTrash size="1.2rem" />
                                        </Button>
                                        <Button
                                            color="green"
                                            ml={10}
                                            variant="light"
                                            w={"max-content"}
                                            onClick={() => {
                                                setEditProduct({
                                                    id: product.id,
                                                    name: product.name,
                                                    description: product.description,
                                                    price: product.price,
                                                    stock: product.stock,
                                                    category: product.category,
                                                    imageUrl: product.imageUrl || '' // Ensure imageUrl is controlled
                                                });
                                                setIsEditModalOpen(true);
                                            }}
                                        >
                                            <IconEdit size="1.2rem" />
                                        </Button>
                                    </div>
                                </Card>
                            </Grid.Col>
                        ))}
                    </Grid>

                    {/* Mobile View */}
                    <Grid hiddenFrom="lg">
                        {data?.listProduct.map((product: any) => (
                            <Grid.Col key={product.id} span={12}>
                                <Card shadow="sm" padding="lg" radius="md" withBorder>
                                    {product.imageUrl && (
                                        <Card.Section>
                                            <img 
                                                src={product.imageUrl} 
                                                alt={product.name} 
                                                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                            />
                                        </Card.Section>
                                    )}
                                    <Group justify="space-between" mt="md" mb="md">
                                        <Text fw={600} size="25px">{product.name}</Text>
                                        <Badge variant="light">${product.price}</Badge>
                                    </Group>

                                    <Group mb="md">
                                        <Badge color="blue" variant="light">
                                            {product.category}
                                        </Badge>
                                        <div className='flex'>
                                            <IconPackage size="1.2rem" style={{ marginRight: '5px' }} /> 
                                            <Text size="sm">
                                                Stock: {product.stock} units
                                            </Text>
                                        </div>
                                    </Group>

                                    <Text size="sm" mb="xl" color="dimmed">
                                        {product.description}
                                    </Text>

                                    <Text size="xs" color="dimmed" mb="md">
                                        Last updated: {new Date(product.updatedAt).toLocaleDateString()}
                                    </Text>

                                    <div className='flex justify-end'>
                                        <Button
                                            color="red"
                                            variant="light"
                                            w={"max-content"}
                                            onClick={() => {
                                                setEditProduct({
                                                    ...editProduct,
                                                    id: product.id
                                                });
                                                setIsDeleteModalOpen(true);
                                            }}
                                        >
                                            <IconTrash size="1.2rem" />
                                        </Button>
                                        <Button
                                            color="green"
                                            ml={10}
                                            variant="light"
                                            w={"max-content"}
                                            onClick={() => {
                                                setEditProduct({
                                                    id: product.id,
                                                    name: product.name,
                                                    description: product.description,
                                                    price: product.price,
                                                    stock: product.stock,
                                                    category: product.category,
                                                    imageUrl: product.imageUrl || '' // Ensure imageUrl is controlled
                                                });
                                                setIsEditModalOpen(true);
                                            }}
                                        >
                                            <IconEdit size="1.2rem" />
                                        </Button>
                                    </div>
                                </Card>
                            </Grid.Col>
                        ))}
                    </Grid>

                    {/* Create Modal */}
                    <Modal
                        opened={isCreateModalOpen}
                        onClose={() => setIsCreateModalOpen(false)}
                        title="Add New Product"
                        size="lg"
                    >
                        <Stack>
                            <TextInput
                                label="Product Name"
                                value={newProduct.name}
                                onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                                required
                            />
                            <TextInput
                                label="Description"
                                value={newProduct.description}
                                onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                                required
                            />
                            <NumberInput
                                label="Price"
                                value={newProduct.price}
                                onChange={(val) => setNewProduct(prev => ({ ...prev, price: typeof val === 'number' ? val : 0 }))}
                                min={0}
                                required
                            />
                            <NumberInput
                                label="Stock"
                                value={newProduct.stock}
                                onChange={(val) => setNewProduct(prev => ({ ...prev, stock: typeof val === 'number' ? val : 0 }))}
                                min={0}
                                required
                            />
                            <TextInput
                                label="Category"
                                value={newProduct.category}
                                onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                                required
                            />
                            <TextInput
                                label="Image URL"
                                value={newProduct.imageUrl}
                                onChange={(e) => setNewProduct(prev => ({ ...prev, imageUrl: e.target.value }))}
                                placeholder="https://example.com/image.jpg"
                            />
                            <Button onClick={handleCreateProduct}>
                                Add Product
                            </Button>
                        </Stack>
                    </Modal>

                    {/* Edit Modal */}
                    <Modal
                        opened={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        title="Edit Product"
                        size="lg"
                    >
                        <Stack>
                            <TextInput
                                label="Product Name"
                                value={editProduct.name}
                                onChange={(e) => setEditProduct(prev => ({ ...prev, name: e.target.value }))}
                                required
                            />
                            <TextInput
                                label="Description"
                                value={editProduct.description}
                                onChange={(e) => setEditProduct(prev => ({ ...prev, description: e.target.value }))}
                                required
                            />
                            <NumberInput
                                label="Price"
                                value={editProduct.price}
                                onChange={(val) => setEditProduct(prev => ({ ...prev, price: typeof val === 'number' ? val : 0 }))}
                                min={0}
                                required
                            />
                            <NumberInput
                                label="Stock"
                                value={editProduct.stock}
                                onChange={(val) => setEditProduct(prev => ({ ...prev, stock: typeof val === 'number' ? val : 0 }))}
                                min={0}
                                required
                            />
                            <TextInput
                                label="Category"
                                value={editProduct.category}
                                onChange={(e) => setEditProduct(prev => ({ ...prev, category: e.target.value }))}
                                required
                            />
                            <TextInput
                                label="Image URL"
                                value={editProduct.imageUrl}
                                onChange={(e) => setEditProduct(prev => ({ ...prev, imageUrl: e.target.value }))}
                                placeholder="https://example.com/image.jpg"
                            />
                            <Button onClick={handleEditProduct}>
                                Update Product
                            </Button>
                        </Stack>
                    </Modal>

                    {/* Delete Confirmation Modal */}
                    <Modal
                        opened={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        title="Delete Product"
                        size="sm"
                    >
                        <Stack>
                            <Text>Are you sure you want to delete this product?</Text>
                            <Button
                                color="red"
                                onClick={() => {
                                    if (editProduct.id) {
                                        deleteProduct({ variables: { id: editProduct.id } });
                                    }
                                }}
                            >
                                Yes, Delete
                            </Button>
                            <Button
                                color="gray"
                                onClick={() => setIsDeleteModalOpen(false)}
                            >
                                Cancel
                            </Button>
                        </Stack>
                    </Modal>
                </Container>
            </AdminGuard>
        </AdminDashboard>
    );
}