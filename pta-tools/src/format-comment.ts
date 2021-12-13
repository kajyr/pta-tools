import { Comment } from './types';

function formatComment(comment: Comment): string {
  return `; ${comment.message}`;
}

export default formatComment;
