import 'dotenv/config';
import { join } from 'path';
import { loadSchemaSync } from '@graphql-tools/load';
import { addResolversToSchema } from '@graphql-tools/schema';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { ApolloServer } from 'apollo-server';

import Query from './graphql/resolvers/Query';
import Mutation from './graphql/resolvers/Mutation';
import User from './graphql/resolvers/User';
import Post from './graphql/resolvers/Post';
import Comment from './graphql/resolvers/Comment';

import createFakeDB from './utils/fakeDataModule';

const fakeDB = createFakeDB();

const schema = loadSchemaSync(join(__dirname, `graphql/schema.graphql`), {
  loaders: [new GraphQLFileLoader()]
});

const resolvers = {
  Query,
  Mutation,
  User,
  Post,
  Comment,
};


const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers,
});

const server = new ApolloServer({ 
  schema: schemaWithResolvers,
  context: { db: fakeDB }
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});