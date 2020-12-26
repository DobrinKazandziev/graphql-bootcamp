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
    createUser(data: CreateUserInput): User!,
    deleteUser(id: ID!): User!,
    createPost(data: CreatePostInput): Post!,
    deletePost(id: ID!): Post!,
    createComment(data: CreateCommentInput): Comment!,
    deleteComment(id: ID!): Comment!,
  }

  input CreateUserInput {
    name: String!, 
    email: String!, 
    age: Int,
  }

  input CreatePostInput {
    title: String!,
    body: String!,
    published: Boolean!,
    author: ID!,
  }

  input CreateCommentInput {
    text: String!,
    author: ID!,
    post: ID!,
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

let users = createFakeUsers(NUM_USERS);
let posts = createFakePosts(NUM_POSTS);
let comments = createFakeComments(NUM_COMMENTS);

const checkEmailTaken = (email) => users.some((user) => user.email === email);
const checkUserExists = (author) => users.some((user) => user.id === author);
const checkPostExistsAndPublished = (post) => posts.some((post) => post.id === post) || !post.published;

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
    createUser: (parent, args, ctx, info) => {
      const emailTaken = checkEmailTaken(args.data.email);

      if (emailTaken) {
        throw new Error('Email taken.')
      };

      const newUser = { id: uuidv4(), ...args.data }; //  { name, email, age } = args.data;
      users.push(newUser);

      return newUser;
    },
    deleteUser: (parent, args, ctx, info) => {
      const userIndex = users.findIndex((user) => user.id === args.id);

      if (userIndex === -1) {
        throw new Error('User not found!');
      };

      const deletedUsers = users.splice(userIndex, 1);  //  Remove user

      posts = posts.filter((post) => {  //  Remove all posts for a given user
        const match = post.author === args.id;

        if (match) { // Remove all comments for that post
          comments = comments.filter((comment) => comment.post !== post.id);
        }

        return !match;
      })
      //  Remove user comments, on different posts
      comments = comments.filter((comment) => comment.author !== args.id);

      return deletedUsers[0];
    },
    createPost: (parent, args, ctx, info) => {
      const userValid = checkUserExists(args.data.author);

      if (!userValid) {
        throw new Error('User not found!')
      };

      const newPost = { id: uuidv4(), ...args.data };  //  { title, body, published, author } = args.data;
      posts.push(newPost);

      return newPost;
    },
    deletePost: (parent, args, ctx, info) => {
      const postIndex = posts.findIndex((post) => post.id === args.id);

      if (postIndex === -1) {
        throw new Error('Post not found!');
      };

      const deletedPosts = posts.splice(postIndex, 1); // Remove post
      comments = comments.filter((comment) => comment.post !== args.id);  //  Remove comments for that post

      return deletedPosts[0];
    },
    createComment: (parent, args, ctx, info) => {
      const userValid = checkUserExists(args.data.author);
      const postValid = checkPostExistsAndPublished(args.data.post);

      if (!userValid || !postValid) {
        throw new Error('Unable to find user and post!');
      };

      const newComment = { id: uuidv4(), ...args.data }; // { text, author, post } = args.data;
      comments.push(newComment);
      
      return newComment;
    },
    deleteComment: (parent, args, ctx, info) => {
      const commentIndex = comments.findIndex((comment) => comment.id === args.id);

      if (commentIndex === -1) {
        throw new Error('Comment not found!');
      }

      const deletedComments = comments.splice(commentIndex, 1); //  Remove comment

      return deletedComments[0];
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