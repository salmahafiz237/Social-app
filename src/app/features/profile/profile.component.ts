import { Component, inject, OnInit, signal } from '@angular/core';
import { ProfileService } from './services/profile.service';
import { Post } from '../timeline/components/posts/models/post.interface';
import { ProfileUser } from './models/profile.interface';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, DatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private readonly profileService = inject(ProfileService);

  profileData = signal<ProfileUser | null>(null);
  myPosts = signal<Post[]>([]);
  savedPosts = signal<Post[]>([]);
  activeTab = signal<'posts' | 'saved'>('posts');

  ngOnInit(): void {
    this.getProfileData();
    this.getBookmarks();
  }

  getProfileData(): void {
    this.profileService.getMyProfile().subscribe({
      next: (res) => {
        if (res.success) {
          this.profileData.set(res.data.user);
  
          // Update shared profile photo
          this.profileService.profilePhoto.set(res.data.user.photo);
  
          this.getUserPosts(res.data.user._id);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getUserPosts(userId: string): void {
    this.profileService.getUserPosts(userId).subscribe({
      next: (res) => {
        if (res.success) {
          this.myPosts.set(res.data.posts);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getBookmarks(): void {
    this.profileService.getBookmarks().subscribe({
      next: (res) => {
        if (res.success) {
          this.savedPosts.set(res.data.bookmarks);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  changeTab(tab: 'posts' | 'saved'): void {
    this.activeTab.set(tab);
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    this.profileService.uploadProfilePhoto(formData).subscribe({
      next: (res) => {
        if (res.success) {
          this.getProfileData();
        }
      },
      error: (err) => {
        console.log(err);
      },
    });

    input.value = '';
  }

  

}
