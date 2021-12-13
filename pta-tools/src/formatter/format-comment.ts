import { Comment } from '../types';

function formatComment(comment: Comment): string {
  return `; ${comment.message}\n\n`;
}

export default formatComment;
