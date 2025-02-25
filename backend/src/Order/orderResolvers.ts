import { getOrder, listOrders, createOrder, updateOrder, deleteOrder } from "./orderHelpers";

const orderResolvers = {
  Query: {
    getOrder: (_: any, args: { id: number }) => getOrder(_, args),
    listOrders: (_: any) => listOrders(),
  },
  Mutation: {
    createOrder: (_: any, args: { input: any }, context: any, info: any) => createOrder(_, args),
    updateOrder: (_: any, args: { id: number, input: any }) => updateOrder(_, args),
    deleteOrder: (_: any, args: { id: number }) => deleteOrder(_, args),
  },
};

export default orderResolvers;
