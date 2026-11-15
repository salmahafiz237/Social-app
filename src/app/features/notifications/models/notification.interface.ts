export interface NotificationUser {
    _id: string;
    name: string;
    photo: string;
  }
  
  export interface NotificationEntity {
    _id: string;
    body?: string;
    image?: string;
    user?: string;
    commentsCount?: number;
    topComment?: any;
    sharesCount?: number;
    likesCount?: number;
    isShare?: boolean;
    id?: string;
  }
  
  export interface INotification {
    _id: string;
    recipient: NotificationUser;
    actor: NotificationUser;
    type: 'like_post' | 'comment_post' | 'share_post' | 'follow' | string;
    entityType: 'post' | 'user' | string;
    entityId: string;
    isRead: boolean;
    createdAt: string;
    entity?: NotificationEntity;
  }