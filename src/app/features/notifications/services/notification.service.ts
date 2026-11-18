import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable,  signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly httpClient = inject(HttpClient);

  // Shared unread notifications count
  unreadCount = signal<number>(0);

  // Get notifications (all or unread only)
  getNotifications(unread: boolean = false, page: number = 1, limit: number = 20): Observable<any> {
    const params = new HttpParams().set('unread', unread).set('page', page).set('limit', limit);

    return this.httpClient.get(environment.baseUrl + 'notifications', { params });
  }

  // Get unread notifications count
  getUnreadCount(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'notifications/unread-count');
  }

  // Mark a single notification as read
  markAsRead(notificationId: string): Observable<any> {
    return this.httpClient.patch(environment.baseUrl + `notifications/${notificationId}/read`, {});
  }

  // Mark all notifications as read
  markAllAsRead(): Observable<any> {
    return this.httpClient.patch(environment.baseUrl + 'notifications/read-all', {});
  }

  // Get unread count
  loadUnreadCount(): void {this.getUnreadCount().subscribe({
    next: (res) => {
      if (res.success) {
        this.unreadCount.set(res.data.unreadCount);
      }
    },
    error: (err) => {
      console.error('Failed to load unread count', err);
    }
  });
}

// Decrease unread count
  decreaseUnreadCount(): void {this.unreadCount.update(count => Math.max(0, count - 1));}

// Reset unread count
  resetUnreadCount(): void {this.unreadCount.set(0);}
}
