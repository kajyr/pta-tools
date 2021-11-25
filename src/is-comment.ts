import { Comment } from './types';

function isComment(data: any): data is Comment {
  return data && typeof data.message === "string";
}

export default isComment;
