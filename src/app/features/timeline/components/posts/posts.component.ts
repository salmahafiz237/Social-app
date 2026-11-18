import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostsService } from './services/posts.service';
import { Post } from './models/post.interface';
import { CommentsComponent } from './components/comments/comments.component';
import { DatePipe, TitleCasePipe} from '@angular/common';
import { SearchPipe } from '../../../../shared/pipes/search-pipe';

@Component({
  selector: 'app-posts',
  imports: [ReactiveFormsModule, CommentsComponent, RouterLink, TitleCasePipe, DatePipe, SearchPipe, FormsModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css',
})
export class PostsComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  allPosts = signal<Post[]>([]);
  userId = signal('');

  // create post
  file = signal<File | null>(null);
  imgSrc = signal('');
  content = new FormControl('');
  privacy = new FormControl('public');
  text = signal('')

  // update post
  editingPostId = signal<string | null>(null);
  editBody = new FormControl('');
  editPrivacy = new FormControl('public');
  editFile = signal<File | null>(null);
  editImgSrc = signal('');

  //share
  shareBody = new FormControl('');
  shareModalPost = signal<Post | null>(null);
  isSharing = signal(false);

  ngOnInit(): void {
    this.getPostsData();
    this.userId.set(JSON.parse(localStorage.getItem('user')!)._id);
  }

  getPostsData(): void {
    this.postsService.getAllPosts().subscribe({
      next: (res) => {
        console.log(res.data.posts);
        this.allPosts.set(res.data.posts);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // ---------- create ----------
  changeFile(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.file.set(input.files[0]);
    this.imgSrc.set(URL.createObjectURL(input.files[0]));
  }

  submitForm(e: Event, reset: HTMLFormElement): void {
    e.preventDefault();

    const formData = new FormData();
    if (this.content.value) {
      formData.append('body', this.content.value);
    }

    if (this.file()) {
      formData.append('image', this.file()!);
    }

    if (this.privacy.value) {
      formData.append('privacy', this.privacy.value);
    }

    this.postsService.createPost(formData).subscribe({
      next: (res) => {
        console.log(res);
        this.getPostsData();
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        reset.reset();
        this.file.set(null);
        this.imgSrc.set('');
      },
    });
  }

  // ---------- update ----------
  startEdit(post: Post): void {
    this.editingPostId.set(post._id);
    this.editBody.setValue(post.body);
    this.editPrivacy.setValue(post.privacy);
    this.editFile.set(null);
    this.editImgSrc.set('');
  }

  cancelEdit(): void {
    this.editingPostId.set(null);
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
        this.getPostsData();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // ---------- delete ----------
  deleteItem(id: string): void {
    this.postsService.deletePost(id).subscribe({
      next: (res) => {
        console.log('Delete response:', res);
        this.allPosts.update((posts) => posts.filter((post) => post._id !== id));
      },
      error: (err) => {
        console.error('Error deleting post:', err);
      },
    });
  }

  //----------likes------------
  likePost(post: Post): void {
    const userId = this.userId();
    const wasLiked = post.likes.includes(userId);
  
    // Update UI immediately
    this.allPosts.update(posts =>
      posts.map(item => {
        if (item._id !== post._id) return item;
  
        return {
          ...item,
          likes: wasLiked
            ? item.likes.filter(id => id !== userId)
            : [...item.likes, userId],
          likesCount: wasLiked
            ? item.likesCount - 1
            : item.likesCount + 1
        };
      })
    );
  
    this.postsService.likePost(post._id).subscribe({
      error: () => {
        // Restore the posts if the request fails
        this.allPosts.update(posts =>
          posts.map(item =>
            item._id === post._id ? post : item
          )
        );
      }
    });
  }

//--------share-------------
sharePost(postId: string): void {
  const body = this.shareBody.value?.trim() || '';

  this.postsService.sharePost(postId, body).subscribe({
    next: () => {
      this.shareBody.setValue('');
      this.getPostsData();
    },
    error: err => {
      console.log(err);
    }
  });
}

openShareModal(post: Post): void {
  this.shareModalPost.set(post);
  this.shareBody.setValue('');
}

closeShareModal(): void {
  this.shareModalPost.set(null);
  this.shareBody.setValue('');
}

confirmShare(): void {
  const post = this.shareModalPost();
  if (!post || this.isSharing()) return;

  this.isSharing.set(true);

  const body = this.shareBody.value?.trim() || '';

  this.postsService.sharePost(post._id, body).subscribe({
    next: () => {
      this.isSharing.set(false);
      this.closeShareModal();
      this.getPostsData();
    },
    error: (err) => {
      this.isSharing.set(false);
      console.log(err);
    }
  });
}
}