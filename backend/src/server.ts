import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import http from 'http';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
 
import { makeExecutableSchema } from "@graphql-tools/schema";
import { mergedResolvers, mergedTypeDefs } from '.';
import { connection, sequelize } from './config/connection';
import defineAssociations from './associations';
 import syncDatabase from './sync';

syncDatabase();

defineAssociations();

dotenv.config();


const app = express();
const httpServer = http.createServer(app);
let schema = makeExecutableSchema({
  typeDefs: [
    mergedTypeDefs,
    ],
  resolvers: [ 
    mergedResolvers
  ],
});
const server = new ApolloServer({
  schema,
 plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});
async function start(){
  await server.start();

}
  connection().then(() => {
start().then(()=>{ 
  app.use(bodyParser.json());
  app.use(
  '/graphql',
  cors<cors.CorsRequest>({ origin: ['http://localhost:3000'] }),
  expressMiddleware(server),

);

app.listen(4000, () => {
  console.log('Running a GraphQL API server at http://localhost:4000/graphql');
}) ;})

});  

process.on('SIGINT', async () => {
  console.log('\n🛑 Closing the database connection...');
  await sequelize.close();
  console.log('\n✅ Database connection closed. Exiting.');
  process.exit(0);
});