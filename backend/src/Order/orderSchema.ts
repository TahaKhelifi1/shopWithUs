import { gql } from 'apollo-server-express';

const orderSchema = gql`

  type Order implements Node {
    id: ID!
    user: User!
    product: Product!
    quantity: Int!
    totalPrice: Float!
    status: String!
    createdAt: Date!
    updatedAt: Date!
  }

  input OrderInput {
    userId: ID!
    productsId: ID!
    quantity: Int!
    totalPrice: Float!
    status: String!
  }

  input UpdateOrderInput {
    userId: ID
    productsId: ID
    quantity: Int
    totalPrice: Float
    status: String
  }

  input OrderFilters {
    id: [ID!]
    userId: [ID!]
    productsId: [ID!]
    status: [String!]
    createdAt: DateFilterInput
    updatedAt: DateFilterInput
  }

  input OrderOrderBy {
    id: Sort
    userId: Sort
    productsId: Sort
    quantity: Sort
    totalPrice: Sort
    status: Sort
    createdAt: Sort
    updatedAt: Sort
  }

  type Query {
    listOrders(filters: OrderFilters, pagination: PaginationOffset, orderBy: OrderOrderBy): [Order!]!
    getOrder(id: ID!): Order
  }

  type Mutation {
    createOrder(input: OrderInput!): Order
    updateOrder(id: ID!, input: UpdateOrderInput!): Order
    deleteOrder(id: ID!): Boolean
  }
`;

export default orderSchema;
