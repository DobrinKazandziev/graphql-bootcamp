import 'dotenv/config';
const { ApolloServer, gql } = require('apollo-server');
import { createUser, createPost, createUsers, createPosts } from './dataModule';

const typeDefs = gql`
  type Query {
    me: User!,
    users(query: String): [User!]!,
    post: Post!,
    posts(query: String): [Post!]!,
  }

  type User {
    id: ID!,
    name: String!,
    email: String!,
    age: Int,
  }

  type Post {
    id: ID!,
    title: String!,
    body: String!,
    published: Boolean!,
  }
`;

const resolvers = {
  Query: {
    me: () => createUser(),
    users: (parent, { query }, ctx, info) => {
      const users = createUsers(3);
      if (query) {
        return users.filter((user) => user.name.toLowerCase().includes(query.toLowerCase()));
      }
      return users;
    },
    post: () => createPost(),
    posts: (partent, { query }, ctx, info) => {
      const posts = createPosts(3);
      if (query) {
        return posts.filter((post) => {
          const isTitleMatched = post.title.toLowerCase().includes(query.toLowerCase());
          const isBodyMatched = post.body.toLowerCase().includes(query.toLowerCase());
          return isTitleMatched || isBodyMatched;
        });
      }
      return posts;
    }
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});