import Order from './models/Order.models';

interface OrderInput {
  userId: number;
  productsId: number;
  quantity: number;
  totalPrice: number;
  status: string;
}

// Get a single order by ID
export const getOrder = async (_: any, { id }: { id: number }) => {
  try {
    const order = await Order.findByPk(id);
    if (!order) {
      throw new Error(`Order with id ${id} not found`);
    }
    return order;
  } catch (error: any) {
    throw new Error(`Error fetching order: ${error.message}`);
  }
};

// Get all orders
export const listOrders = async () => {
  try {
    return await Order.findAll();
  } catch (error: any) {
    throw new Error(`Error fetching orders: ${error.message}`);
  }
};

// Create a new order
export const createOrder = async (_: any, { input }: { input: any }) => {
  try {
    return await Order.create(input);
  } catch (error: any) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map((e: any) => e.message).join(', ');
      throw new Error(`Validation error: ${messages}`);
    }
    throw new Error(`Error creating order: ${error.message}`);
  }
};

// Update an existing order
export const updateOrder = async (_: any, { id, input }: { id: number; input: OrderInput }) => {
  try {
    const order = await Order.findByPk(id);
    if (!order) {
      throw new Error(`Order with id ${id} not found`);
    }
    await order.update(input);
    return order;
  } catch (error: any) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map((e: any) => e.message).join(', ');
      throw new Error(`Validation error: ${messages}`);
    }
    throw new Error(`Error updating order: ${error.message}`);
  }
};

// Delete an order
export const deleteOrder = async (_: any, { id }: { id: number }) => {
  try {
    const order = await Order.findByPk(id);
    if (!order) {
      throw new Error(`Order with id ${id} not found`);
    }
    await order.destroy();
    return order;
  } catch (error: any) {
    throw new Error(`Error deleting order: ${error.message}`);
  }
};
