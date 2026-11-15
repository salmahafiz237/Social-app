export interface ProfileUser {
    _id: string;
    name: string;
    username: string;
    email: string;
    dateOfBirth: string;
    gender: string;
    photo: string;
    cover: string;
    followers: ProfileFollower[];
    following: ProfileFollower[];
    followersCount: number;
    followingCount: number;
    bookmarksCount: number;
    id: string;
  }
  
  export interface ProfileFollower {
    _id: string;
    name: string;
    photo: string;
    followersCount: number;
    followingCount: number;
    bookmarksCount: number;
    id: string;
  }