import 'dotenv/config';
const { ApolloServer, gql } = require('apollo-server');
// import defaultMsg, { name, location, getGreeting, add, subtract } from './utilModule';
import { books, user, product } from './dataModule';

// console.log(`Hello GraphQL project: ${defaultMsg}`);
// console.log(`Name: ${name}`);
// console.log(`My Location: ${location}`);
// console.log(getGreeting('Max'));
// console.log(`add(3,5):${add(3,5)}, subtract(5,2):${subtract(5,2)}`);


const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String  
  }

  type User {
      id: ID!,
      name: String!,
      age: Int!,
      employed: Boolean!,
      gpa: Float,
  }

  type Product {
      id: ID!,
      title: String!,
      price: Float!,
      releaseYear: Int,
      rating: Float,
      inStock: Boolean!,
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book],
    name: String!,
    location: String!,
    user: User!,
    product: Product!,
  }
`;

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        books: () => books,
        name: () => 'Dobrin Kazandziev',
        location: () => 'Skopje',
        user: () => user,
        product: () => product,
    },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});