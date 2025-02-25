import Product from './models/Product.model';

interface ProductInput {
  name: string;
  price: string;
  description: string;
  stock: number;
  category: string;
  imageUrl: string;
}

export const getProduct = async (_: any, { id }: { id: number }) => {
  try {
    return await Product.findByPk(id);
  } catch (error: any) {
    throw new Error(`Failed to get the product with id ${id}: ${error.message}`);
  }
};

export const listProduct = async () => {
  try {
    return await Product.findAll();
  } catch (error: any) {
    throw new Error(`Failed to get the list of products: ${error.message}`);
  }
};

export const createProduct = async (_: any, { input }: { input: any }) => {
  try {
    // Check if a product with the same name already exists
    const existingProduct = await Product.findOne({ where: { name: input.name } });
    if (existingProduct) {
      throw new Error('Product with this name already exists.');
    }

    // Create the product
    return await Product.create(input);
  } catch (error: any) {
    if (error.name === 'SequelizeValidationError') {
      // Provide detailed validation error messages
      const messages = error.errors.map((e: any) => e.message).join(', ');
      throw new Error(`Validation error: ${messages}`);
    }
    throw new Error(`Error creating product: ${error.message}`);
  }
};

export const updateProduct = async (_: any, { id, input }: { id: string; input: ProductInput }) => {
  try {
    // Find the product by its ID
    const product = await Product.findByPk(id);
    if (!product) {
      throw new Error('Product not found');
    }

    // Update the product with the input values
    await product.update(input);
    return product;
  } catch (error: any) {
    if (error.name === 'SequelizeValidationError') {
      // Provide detailed validation error messages
      throw new Error(`Validation error: ${error.errors.map((e: any) => e.message).join(', ')}`);
    }
    throw new Error(`Error updating product: ${error.message}`);
  }
};

export const deleteProduct = async (_: any, { id }: { id: string }) => {
  try {
    // Find the product by its ID
    const product = await Product.findByPk(id);
    if (!product) {
      throw new Error('Product not found');
    }

    // Delete the product
    await product.destroy();

    // Return the deleted product's data
    return product;
  } catch (error: any) {
    throw new Error(`Error deleting product: ${error.message}`);
  }
};
