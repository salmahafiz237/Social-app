export interface Comment {
  _id: string;
  name: string;
  image: string;
  commentCreator: CommentCreator;
  post: string;
  parentComment: string | null;
  likes: string[];
  createdAt: Date;
  repliesCount: number;
  content: string;
  isReply?: boolean;
}


export interface CommentCreator {
  _id: string;
  name: string;
  username: string;
  photo: string;
}

export interface CommentReply extends Comment {
  parentComment: string;
}
