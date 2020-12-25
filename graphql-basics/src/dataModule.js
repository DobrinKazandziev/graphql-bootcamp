// const faker = require('faker');
import faker from 'faker';

const createUser = () => {
  const firstName = faker.name.firstName();
  return {
    id: faker.random.uuid,
    name: firstName,
    email: faker.internet.email(firstName),
    age: faker.random.boolean() ? faker.random.number(100) : null,
  }
}


const createPost = () => {
  return {
    id: faker.random.uuid,
    title: faker.lorem.sentence(),
    body: faker.lorem.text(),
    published:  faker.random.boolean(),
  }
}

const createUsers = (numUsers) => [...Array(numUsers).fill(null).map(() => createUser())];
const createPosts = (numPosts) => [...Array(numPosts).fill(null).map(() => createPost())];

export {
  createUser,
  createPost,
  createUsers,
  createPosts,
}

