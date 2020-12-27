import { chechPostIdExistsAndPublished } from '../../utils/utilsModule';

const Subscription = {
  commentSub: {
    subscribe: (parent, { postId }, { db, pubsub }, info) => {
      const post = chechPostIdExistsAndPublished(postId, db.posts);

      if (!post) {
          throw new Error('Post not found!');
      }

      return pubsub.asyncIterator(`COMMENT_SUB ${postId}`);
    }
  },
  postSub: {
    subscribe: (parent, args, { pubsub }, info) => {
      return pubsub.asyncIterator(`POST_SUB`);
    }
  },
}

export { Subscription as default }
