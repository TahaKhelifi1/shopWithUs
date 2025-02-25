import { gql } from 'apollo-server-express';

const orderTypeDef = gql`
  type Order {
    id: ID!
    userId: Int!
    productsId: Int!
    quantity: Int!
    totalPrice: Float!
    status: String!
  }

  input OrderInput {
    userId: Int!
    productsId: Int!
    quantity: Int!
    totalPrice: Float!
    status: String!
  }

  type Query {
    listOrders: [Order]!
    getOrder(id: ID!): Order
    getOrdersByUser(userId: ID!): [Order]!
  }

  type Mutation {
    createOrder(input: OrderInput!): Order!
    updateOrder(id: ID!,input: OrderInput! ): Order
    deleteOrder(id: ID!): Order
  }
`;

export default orderTypeDef;
