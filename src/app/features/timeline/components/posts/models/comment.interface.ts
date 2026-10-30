export interface Comment {
    _id: string;
    name: string;
    image: string;
    commentCreator: CommentCreator;
    post: string;
    parentComment: null;
    likes: any[];
    createdAt: Date;
    repliesCount: number;
    // body:string;
    content: string;
}

export interface CommentCreator {
    _id: string;
    name: string;
    username: string;
    photo: string;
}
