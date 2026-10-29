import { Component, inject, OnInit, signal } from '@angular/core';
import { PostsService } from './services/posts.service';
import { Post } from './models/post.interface';

@Component({
  selector: 'app-posts',
  imports: [],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css',
})
export class PostsComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  allPosts= signal<Post[]>([]);
  ngOnInit(): void {
    this.getPostsData();
  }

  getPostsData(): void {
    this.postsService.getAllPosts().subscribe({
      next: (res) => {
        console.log(res.data.posts);
        this.allPosts.set(res.data.posts)
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
