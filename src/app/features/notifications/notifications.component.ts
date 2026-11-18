import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from './services/notification.service';
import { INotification } from './models/notification.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-notifications',
  imports: [DatePipe],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent implements OnInit {
  private readonly notificationsService = inject(NotificationService);
  private readonly router = inject(Router);

  notifications = signal<INotification[]>([]);
  unreadCount = this.notificationsService.unreadCount;
  activeFilter = signal<'all' | 'unread'>('all');

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    const onlyUnread = this.activeFilter() === 'unread';
    this.notificationsService.getNotifications(onlyUnread, 1, 20).subscribe({
      next: (res) => {
        if (res.success) {
          this.notifications.set(res.data.notifications);
        }
      },
      error: (err) => {
        console.error('Failed to load notifications', err);
      },
    });
  }

  loadUnreadCount(): void {
    this.notificationsService.getUnreadCount().subscribe({
      next: (res) => {
        if (res.success) {
          this.unreadCount.set(res.data.unreadCount);
        }
      },
      error: (err) => {
        console.error('Failed to load unread count', err);
      },
    });
  }

  setFilter(filter: 'all' | 'unread'): void {
    if (this.activeFilter() === filter) return;
    this.activeFilter.set(filter);
    this.loadNotifications();
  }

  markOneAsRead(notification: INotification, event?: Event): void {
    event?.stopPropagation();
    if (notification.isRead) return;

    this.notificationsService.markAsRead(notification._id).subscribe({
      next: (res) => {
        if (res.success) {
          if (this.activeFilter() === 'unread') {
            this.notifications.set(
              this.notifications().filter((item) => item._id !== notification._id)
            );
          } else {
            this.notifications.set(
              this.notifications().map((item) =>
                item._id === notification._id ? { ...item, isRead: true } : item
              )
            );
          }
          this.notificationsService.decreaseUnreadCount();
        }
      },
      error: (err) => {
        console.error('Failed to mark notification as read', err);
      },
    });
  }

  markAllAsRead(): void {
    if (this.unreadCount() === 0) return;

    this.notificationsService.markAllAsRead().subscribe({
      next: (res) => {
        if (res.success) {
          if (this.activeFilter() === 'unread') {
            this.notifications.set([]);
          } else {
            this.notifications.set(
              this.notifications().map((item) => ({ ...item, isRead: true }))
            );
          }
          this.notificationsService.resetUnreadCount();
        }
      },
      error: (err) => {
        console.error('Failed to mark all as read', err);
      },
    });
  }

  openNotification(notification: INotification): void {
    if (!notification.isRead) {
      this.markOneAsRead(notification);
    }

    if (notification.entityType === 'post' && notification.entityId) {
      this.router.navigate(['/details', notification.entityId]);
    }
  }

  getActionText(type: string): string {
    switch (type) {
      case 'like_post':
        return 'liked your post';
      case 'comment_post':
        return 'commented on your post';
      case 'share_post':
        return 'shared your post';
      case 'follow':
        return 'followed you';
      default:
        return 'interacted with you';
    }
  }

}