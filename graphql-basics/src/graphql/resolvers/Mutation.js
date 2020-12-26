import { v4 as uuidv4 } from 'uuid';
import * as utils from '../../utils/utilsModule';

const Mutation = {
  createUser: (parent, { data }, { db }, info) => {
    const emailTaken = utils.checkEmailTaken(data.email, db.users);

    if (emailTaken) {
      throw new Error('Email taken.')
    };

    const newUser = { id: uuidv4(), ...data }; //  { name, email, age } = args.data;
    db.users.push(newUser);

    return newUser;
  },
  deleteUser: (parent, { id }, { db }, info) => {
    const userIndex = db.users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      throw new Error('User not found!');
    };

    const deletedUsers = db.users.splice(userIndex, 1);  //  Remove user

    db.posts = db.posts.filter((post) => {  //  Remove all posts for a given user
      const match = post.author === id;

      if (match) { // Remove all comments for that post
        db.comments = db.comments.filter((comment) => comment.post !== post.id);
      }

      return !match;
    })
    //  Remove user comments, on different posts
    db.comments = db.comments.filter((comment) => comment.author !== id);

    return deletedUsers[0];
  },
  createPost: (parent, { data }, { db }, info) => {
    const userValid = utils.checkUserExists(data.author, db.users);

    if (!userValid) {
      throw new Error('User not found!')
    };

    const newPost = { id: uuidv4(), ...data };  //  { title, body, published, author } = args.data;
    db.posts.push(newPost);

    return newPost;
  },
  deletePost: (parent, { id }, { db }, info) => {
    const postIndex = db.posts.findIndex((post) => post.id === id);

    if (postIndex === -1) {
      throw new Error('Post not found!');
    };

    const deletedPosts = db.posts.splice(postIndex, 1); // Remove post
    db.comments = db.comments.filter((comment) => comment.post !== id);  //  Remove comments for that post

    return deletedPosts[0];
  },
  createComment: (parent, { data }, { db }, info) => {
    const userValid = utils.checkUserExists(data.author, db.users);
    const postValid = utils.checkPostExistsAndPublished(data.post, db.posts);

    if (!userValid || !postValid) {
      throw new Error('Unable to find user and post!');
    };

    const newComment = { id: uuidv4(), ...data }; // { text, author, post } = args.data;
    db.comments.push(newComment);
    
    return newComment;
  },
  deleteComment: (parent, { id }, { db }, info) => {
    const commentIndex = db.comments.findIndex((comment) => comment.id === id);

    if (commentIndex === -1) {
      throw new Error('Comment not found!');
    }

    const deletedComments = db.comments.splice(commentIndex, 1); //  Remove comment

    return deletedComments[0];
  }
};

export { 
  Mutation as default,
}