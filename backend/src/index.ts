import { mergeResolvers } from "@graphql-tools/merge";
import { mergeTypeDefs } from "@graphql-tools/merge";


//Calls the Resolvers
import orderResolvers from "./Order/orderResolvers";
import productResolvers from "./Product/productResolver";
import userResolvers from "./User/userResolver";


//Calls The TypeDefs

import userTypesDef from "./User/userTypeDef";
import productTypeDef from "./Product/productsTypesDef";
import orderTypeDef from "./Order/orderTypeDef";


const mergedTypeDefs = mergeTypeDefs([userTypesDef, productTypeDef, orderTypeDef]);

const mergedResolvers = mergeResolvers([orderResolvers,productResolvers,userResolvers]);

export { mergedTypeDefs, mergedResolvers };