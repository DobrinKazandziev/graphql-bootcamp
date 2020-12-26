const checkEmailTaken = (email, users) => users.some((user) => user.email === email);
const checkUserExists = (author, users) => users.some((user) => user.id === author);
const checkPostExistsAndPublished = (post, posts) => posts.some((post) => post.id === post) || !post.published;

export {
  checkEmailTaken,
  checkUserExists,
  checkPostExistsAndPublished,
}