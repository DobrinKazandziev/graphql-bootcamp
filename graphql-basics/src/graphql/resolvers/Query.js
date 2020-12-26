const Query = {
  users: (parent, { query }, { db }, info) => {
    if (query) {
      const isNameMatched = users.filter((user) => db.user.name.toLowerCase().includes(query.toLowerCase()));
      return isNameMatched;
    }
    return db.users;
  },
  posts: (parent, { query }, { db }, info) => {
    if (query) {
      return db.posts.filter((post) => {
        const isTitleMatched = post.title.toLowerCase().includes(query.toLowerCase());
        const isBodyMatched = post.body.toLowerCase().includes(query.toLowerCase());
        return isTitleMatched || isBodyMatched;
      });
    }
    return db.posts;
  },
  comments: (parent, { query }, { db }, info) => {
    if (query) {
      const isCommentMatched = db.comments.filter((comment) => comment.text.toLowerCase().includes(query.toLowerCase()));
      return isCommentMatched;
    }
    return db.comments;
  },
}

export {
  Query as default,
}