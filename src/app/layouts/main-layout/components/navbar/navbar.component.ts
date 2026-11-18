import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { NotificationService } from '../../../../features/notifications/services/notification.service';
import { ProfileService } from '../../../../features/profile/services/profile.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {

  private readonly authService = inject(AuthService);
  private readonly notificationsService = inject(NotificationService);
  private readonly profileService = inject(ProfileService);

  profileData = signal<any>(null);
  profilePhoto = this.profileService.profilePhoto;

  // Shared unread count
  unreadCount = this.notificationsService.unreadCount;

  ngOnInit(): void {
    initFlowbite();

    const user = localStorage.getItem('user');

    if (user) {
      this.profileData.set(JSON.parse(user));
    }

    // Get unread notifications count
    this.notificationsService.loadUnreadCount();
  }

  logOut(): void {
    this.authService.logOut();
  }
}
