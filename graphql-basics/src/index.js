import 'dotenv/config';
const { ApolloServer, gql } = require('apollo-server');
import { NUM_USERS, NUM_POSTS, createUser, createPost, createUsers, createPosts } from './dataModule';

const typeDefs = gql`
  type Query {
    me: User!,
    post: Post!,
    users(query: String): [User!]!,
    posts(query: String): [Post!]!,
  }

  type User {
    id: ID!,
    name: String!,
    email: String!,
    age: Int,
    posts: [Post!]!,
  }

  type Post {
    id: ID!,
    title: String!,
    body: String!,
    published: Boolean!,
    author: User!,
  }
`;

const users = createUsers(NUM_USERS);
const posts = createPosts(NUM_POSTS);

const resolvers = {
  Query: {
    me: () => createUser(),
    post: () => createPost(),
    users: (parent, { query }, ctx, info) => {
      if (query) {
        const isNameMatched = users.filter((user) => user.name.toLowerCase().includes(query.toLowerCase()));
        return isNameMatched;
      }
      return users;
    },
    posts: (partent, { query }, ctx, info) => {
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
  Post: {
    author: (parent, args, ctx, info) => users.find((user) => user.id === parent.author),
  },
  User: {
    posts: (parent, args, ctx, info) => posts.filter((post) => post.author === parent.id),
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});