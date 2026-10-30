export interface Post {
    _id: string
    body: string
    privacy: string
    user: User
    sharedPost: any
    likes: string[]
    createdAt: string
    image: string
    commentsCount: number
    // topComment: TopComment
    sharesCount: number
    likesCount: number
    isShare: boolean
    id: string
    bookmarked: boolean
  }
  
  export interface User {
    _id: string
    name: string
    username: string
    photo: string
  }
  
