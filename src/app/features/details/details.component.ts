import { Component, inject, OnInit, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PostsService } from '../timeline/components/posts/services/posts.service';
import { Post } from '../timeline/components/posts/models/post.interface';
import { CommentsComponent } from '../timeline/components/posts/components/comments/comments.component';

@Component({
  selector: 'app-details',
  imports: [ReactiveFormsModule, CommentsComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly postsService = inject(PostsService);
  private readonly location = inject(Location);

  postData = signal<Post | null>(null);
  userId = signal('');
  loading = signal(true);

  // update post
  isEditing = signal(false);
  editBody = new FormControl('');
  editPrivacy = new FormControl('public');
  editFile = signal<File | null>(null);
  editImgSrc = signal('');

  ngOnInit(): void {
    this.userId.set(JSON.parse(localStorage.getItem('user')!)._id);

    this.activatedRoute.paramMap.subscribe((params) => {
      this.getSinglePost(params.get('id')!);
    });
  }

  getSinglePost(id: string): void {
    this.postsService.getSinglePost(id).subscribe({
      next: (res) => {
        console.log(res.data.post);
        this.postData.set(res.data.post);
        this.loading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.loading.set(false);
      },
    });
  }

  goBack(): void {
    this.location.back();
  }

  // ---------- update ----------
  startEdit(post: Post): void {
    this.isEditing.set(true);
    this.editBody.setValue(post.body);
    this.editPrivacy.setValue(post.privacy);
    this.editFile.set(null);
    this.editImgSrc.set('');
  }

  cancelEdit(): void {
    this.isEditing.set(false);
    this.editFile.set(null);
    this.editImgSrc.set('');
  }

  changeEditFile(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.editFile.set(input.files[0]);
    this.editImgSrc.set(URL.createObjectURL(input.files[0]));
  }

  updatePost(postId: string): void {
    const formData = new FormData();
    if (this.editBody.value) {
      formData.append('body', this.editBody.value);
    }
    if (this.editPrivacy.value) {
      formData.append('privacy', this.editPrivacy.value);
    }
    if (this.editFile()) {
      formData.append('image', this.editFile()!);
    }

    this.postsService.updatePost(postId, formData).subscribe({
      next: (res) => {
        console.log(res);
        this.cancelEdit();
        this.getSinglePost(postId);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // ---------- delete ----------
  deleteItem(postId: string): void {
    this.postsService.deletePost(postId).subscribe({
      next: (res) => {
        console.log('Delete response:', res);
        this.goBack();
      },
      error: (err) => {
        console.error('Error deleting post:', err);
      },
    });
  }
}