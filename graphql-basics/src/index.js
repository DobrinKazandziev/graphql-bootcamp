import 'dotenv/config';
const { ApolloServer, gql } = require('apollo-server');
import {
  NUM_USERS, 
  NUM_POSTS,
  NUM_COMMENTS,
  createUser, 
  createPost, 
  createUsers, 
  createPosts,
  createComments,
} from './dataModule';

const typeDefs = gql`
  type Query {
    me: User!,
    post: Post!,
    users(query: String): [User!]!,
    posts(query: String): [Post!]!,
    comments(query: String): [Comment!]!,
  }

  type User {
    id: ID!,
    name: String!,
    email: String!,
    age: Int,
    posts: [Post!]!,
    comments: [Comment!]!,
  }

  type Post {
    id: ID!,
    title: String!,
    body: String!,
    published: Boolean!,
    author: User!,
    comments: [Comment!]!,
  }

  type Comment {
    id: ID!,
    text: String!,
    author: User!,
    post: Post!,
  }
`;

const users = createUsers(NUM_USERS);
const posts = createPosts(NUM_POSTS);
const comments = createComments(NUM_COMMENTS);

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
    posts: (parent, { query }, ctx, info) => {
      if (query) {
        return posts.filter((post) => {
          const isTitleMatched = post.title.toLowerCase().includes(query.toLowerCase());
          const isBodyMatched = post.body.toLowerCase().includes(query.toLowerCase());
          return isTitleMatched || isBodyMatched;
        });
      }
      return posts;
    },
    comments: (parent, { query }, ctx, info) => {
      if (query) {
        const isCommentMatched = comments.filter((comment) => comment.text.toLowerCase().includes(query.toLowerCase()));
        return isCommentMatched;
      }
      return comments;
    }
  },
  User: {
    posts: (parent, args, ctx, info) => posts.filter((post) => post.author === parent.id),
    comments: (parent, args, ctx, info) => comments.filter((comment) => comment.author === parent.id)
  },
  Post: {
    author: (parent, args, ctx, info) => users.find((user) => user.id === parent.author),
    comments: (parent, args, ctx, info) => comments.filter((comment) => comment.post === parent.id),
  },
  Comment: {
    author: (parent, args, ctx, info) => users.find((user) => user.id === parent.author),
    post: (parent, args, ctx, info) => posts.find((post) => post.id === parent.post),
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});