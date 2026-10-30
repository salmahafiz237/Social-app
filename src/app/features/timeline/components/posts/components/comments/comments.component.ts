import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/comment.interface';

@Component({
  selector: 'app-comments',
  imports: [],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css',
})
export class CommentsComponent implements OnInit {
  private readonly commentService = inject(CommentService);
  postId = input.required<string>();
  allComments = signal<Comment[]>([]);

  ngOnInit(): void {
    this.getComments();
  }

  getComments(): void {
    this.commentService.getAllComments(this.postId()).subscribe({
      next:(res)=>{
        console.log(res.data.comments);
        this.allComments.set(res.data.comments)
      },
      error:(err)=> {
        console.log(err);
      },
    });
  }
}
