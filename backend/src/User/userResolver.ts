import { getUser, getUsers, createUser, updateUser, deleteUser, signIn, forgotPassword, resetPassword } from './UserHelper';

const userResolvers = {
  Query: {
    getUser: async (_: any, { id }: { id: string }) => getUser(id),
    
    getUsers: async (_: any) => getUsers()

  },
  Mutation: {
    signIn: async (_: any, { email, password }: { email: string; password: string }) => signIn(email, password),
    
    createUser: async (_: any, { input }: { input: any }) => createUser(input),
   
    updateUser: async (_: any, { id, input }: { id: string; input: any }) => updateUser(id, input), 

    deleteUser: async (_: any, { id }: { id: string }) =>deleteUser(id), 
    
    forgotPassword: async (_: any, { email }: { email: string }) =>forgotPassword(email),
    
    resetPassword: async (_: any, { email, code, newPassword }: { email: string, code: string, newPassword: string }) =>resetPassword(email, code, newPassword), 
  },
};

export default userResolvers;
