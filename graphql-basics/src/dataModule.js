// const faker = require('faker');
import faker from 'faker';

const NUM_USERS = 2;
const NUM_POSTS = 6;
const NUM_COMMENTS = 10;

const randomNumArbitrary = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const createUser = (idx) => {
  const firstName = faker.name.firstName();
  return {
    id: idx,
    name: firstName,
    email: faker.internet.email(firstName),
    age: faker.random.boolean() ? faker.random.number(100) : null,
  }
}

const createPost = (idx) => {
  return {
    id: idx,
    title: faker.lorem.sentence(),
    body: faker.lorem.text(),
    published: faker.random.boolean(),
    author: randomNumArbitrary(0, NUM_USERS-1),
  }
}

const createComment = (idx) => {
  return {
    id: idx,
    text: faker.lorem.text(),
    author: randomNumArbitrary(0, NUM_USERS-1),
    post: randomNumArbitrary(0, NUM_POSTS-1),
  }
}

const createUsers = () => [...Array(NUM_USERS).fill(null).map((val, idx) => createUser(idx))];
const createPosts = () => [...Array(NUM_POSTS).fill(null).map((val, idx) => createPost(idx))];
const createComments = () => [...Array(NUM_COMMENTS).fill(null).map((val, idx) => createComment(idx))];

export {
  NUM_USERS,
  NUM_POSTS,
  createUser,
  createPost,
  createUsers,
  createPosts,
  createComments,
}
