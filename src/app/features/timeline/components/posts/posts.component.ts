import { Component, inject, OnInit } from '@angular/core';
import { PostsService } from './services/posts.service';

@Component({
  selector: 'app-posts',
  imports: [],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css',
})
export class PostsComponent implements OnInit {
  private readonly postsService = inject(PostsService);

  ngOnInit(): void {
    this.getPostsData();
  }

  getPostsData(): void {
    this.postsService.getAllPosts().subscribe({
      next: (res) => {
        console.log(res.data.posts);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
