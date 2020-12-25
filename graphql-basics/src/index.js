import 'dotenv/config';
import { v4 as uuidv4 } from 'uuid'
const { ApolloServer, gql, AuthenticationError } = require('apollo-server');

import {
  NUM_USERS, 
  NUM_POSTS,
  NUM_COMMENTS,
  createFakeUser, 
  createFakePost, 
  createFakeUsers, 
  createFakePosts,
  createFakeComments,
} from './dataModule';

const typeDefs = gql`
  type Query {
    me: User!,
    post: Post!,
    users(query: String): [User!]!,
    posts(query: String): [Post!]!,
    comments(query: String): [Comment!]!,
  }

  type Mutation {
    createUser(name: String!, email: String!, age: Int): User!,
    createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!,
    createComment(text: String!, author: ID!, post: ID!): Comment!,
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

const users = createFakeUsers(NUM_USERS);
const posts = createFakePosts(NUM_POSTS);
const comments = createFakeComments(NUM_COMMENTS);

const checkEmailTaken = (email) => users.some((user) => user.email === email);
const checkUserExists = (author) => users.some((user) => Number(user.id) === Number(author));
const checkPostExistsAndPublished = (post) => posts.some((post) => Number(post.id) === Number(post)) || !post.published;

const resolvers = {
  Query: {
    me: () => createFakeUser(),
    post: () => createFakePost(),
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
  Mutation: {
    createUser: (parent, { name, email, age }, ctx, info) => {
      const emailTaken = checkEmailTaken(email);

      if (emailTaken) {
        throw new Error('Email taken.')
      };

      const newUser = {
        id: uuidv4(),
        name: name,
        email: email,
        age: age,
      };

      users.push(newUser);

      return newUser;
    },
    createPost: (parent, { title, body, published, author }, ctx, info) => {
      const userValid = checkUserExists(author);

      if (!userValid) {
        throw new Error('User not found!')
      };

      const newPost = {
        id: uuidv4(),
        title: title,
        body: body,
        published: published,
        author: Number(author),
      };

      posts.push(newPost);

      return newPost;
    },
    createComment: (parent, { text, author, post }, ctx, info) => {
      const userValid = checkUserExists(author);
      const postValid = checkPostExistsAndPublished(post);

      if (!userValid || !postValid) {
        throw new Error('Unable to find user and post!');
      };

      const newComment = {
        id: uuidv4(),
        text: text,
        author: Number(author),
        post: Number(post),
      }

      comments.push(newComment);
      
      return newComment;
    },
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