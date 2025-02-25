import { gql } from 'apollo-server-express';

const userTypesDef = gql`
  # Define the User type with necessary fields
  type User {
    id: ID!
    nom: String!        # Updated from 'nom' to 'name' for consistency with the model
    prenom: String!
    email: String!
    password: String!
    is_admin: Boolean!  
    token: String!     # Added 'is_admin' to match the model
    

  }

  # Define the input type for user creation and update
  input UserInput {
    nom: String         # Updated from 'nom' to 'name' for consistency with the model
    prenom: String
    email: String
    password: String
    is_admin: Boolean         # Added 'is_admin' to match the model     
  }

  # Define the query type for fetching users
  type Query {
    getUser(id: ID!): User
    getUsers: [User]
  }
  type AuthPayload {
        token: String
        user: User
    }

    type ResetResponse {
        success: Boolean
        message: String
    }

    type VerificationResponse {
        success: Boolean!
        message: String!
    }

  # Define the mutation type for creating, updating, and deleting users
  type Mutation {
    createUser(input: UserInput!): User      # Updated argument name to 'input' for consistency
    updateUser(id: ID!, input: UserInput!): User # Updated argument name to 'input' for consistency
    deleteUser(id: ID!): User               # Updated return type to 'User' to return the deleted user's details
    signIn(email: String!, password: String!): AuthPayload
    forgotPassword(email: String!): ResetResponse!
    resetPassword(token: String!, password: String!): ResetResponse!
    adminResetPassword(userId: ID!, newPassword: String!): User
    sendAdminVerification(email: String!): VerificationResponse!
    verifyAdminCode(email: String!, code: String!): VerificationResponse!

  }

`;

export default userTypesDef;
