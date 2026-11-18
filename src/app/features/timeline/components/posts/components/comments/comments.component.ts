import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { Comment, CommentCreator, CommentReply } from '../../models/comment.interface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-comments',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css',
})
export class CommentsComponent implements OnInit {
  private readonly commentService = inject(CommentService);
  postId = input.required<string>();
  allComments = signal<Comment[]>([]);
  userId = signal('');
  currentUser = signal<CommentCreator>({} as CommentCreator);

  // create
  content = new FormControl('');
  file = signal<File | null>(null);
  imgSrc = signal('');

  // update
  editingId = signal<string | null>(null);
  editContent = new FormControl('');
  editFile = signal<File | null>(null);
  editImgSrc = signal('');

  // reply
  replyingTo = signal<string | null>(null);
  replyContent = new FormControl('');
  repliesByComment = signal<Record<string, CommentReply[]>>({});
  expandedReplies = signal<Record<string, boolean>>({});
  loadedReplies = signal<Record<string, boolean>>({});

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.currentUser.set(user);
    this.userId.set(user._id);
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

  // ---------- create ----------
  changeFile(e:Event):void{
    const input = e.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.file.set(input.files[0]);
    this.imgSrc.set(URL.createObjectURL(input.files[0]));
  }

  createComment(fileInput: HTMLInputElement): void {
    if (!this.content.value && !this.file()) return;

    const formData = new FormData();
    if (this.content.value) {
      formData.append('content', this.content.value);
    }
    if (this.file()) {
      formData.append('image', this.file()!);
    }

    this.commentService.createComment(this.postId(), formData).subscribe({
      next: (res) => {
        console.log(res);
        this.getComments();
        this.content.reset('');
        this.file.set(null);
        this.imgSrc.set('');
        fileInput.value = '';
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // ---------- update ----------
  startEdit(comment: Comment): void {
    this.editingId.set(comment._id);
    this.editContent.setValue(comment.content);
    this.editFile.set(null);
    this.editImgSrc.set('');
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.editFile.set(null);
    this.editImgSrc.set('');
  }

  changeEditFile(e:Event):void{
    const input = e.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.editFile.set(input.files[0]);
    this.editImgSrc.set(URL.createObjectURL(input.files[0]));
  }

  updateComment(commentId: string): void {
    const formData = new FormData();
    if (this.editContent.value) {
      formData.append('content', this.editContent.value);
    }
    if (this.editFile()) {
      formData.append('image', this.editFile()!);
    }

    this.commentService.updateComment(this.postId(), commentId, formData).subscribe({
      next: (res) => {
        console.log(res);
        this.cancelEdit();
        this.getComments();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // ---------- delete ----------
  deleteComment(commentId: string): void {
    this.commentService.deleteComment(this.postId(), commentId).subscribe({
      next: (res) => {
        console.log(res);
        this.allComments.update((comments) => comments.filter((c) => c._id !== commentId));
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  //-----------like------------
  likeComment(comment: Comment): void {
    const userId = this.userId();
    const wasLiked = comment.likes.includes(userId);
  
    this.allComments.update(comments =>
      comments.map(item => {
        if (item._id !== comment._id) return item;
  
        return {
          ...item,
          likes: wasLiked
            ? item.likes.filter(id => id !== userId)
            : [...item.likes, userId]
        };
      })
    );
  
    this.commentService.likeComment(this.postId(), comment._id).subscribe({
        error: () => {
          // Restore the previous state if the request fails
          this.allComments.update(comments =>
            comments.map(item =>
              item._id === comment._id ? comment : item
            )
          );
        }
      });
  }

  
  // ---------- toggle reply form ----------
  toggleReplyForm(commentId: string): void {
    if (this.replyingTo() === commentId) {
      this.replyingTo.set(null);
      this.replyContent.reset('');
      return;
    }

    this.replyingTo.set(commentId);
    this.replyContent.reset('');
  }

  // ---------- create reply ----------
  createReply(commentId: string): void {
    const content = this.replyContent.value?.trim();

    if (!content) return;

    const formData = new FormData();
    formData.append('content', content);

    this.commentService
      .createReply(this.postId(), commentId, formData)
      .subscribe({
        next: (res) => {
          const newReply: CommentReply = res.data.reply;

          this.repliesByComment.update(replies => ({
            ...replies,
            [commentId]: [
              ...(replies[commentId] || []),
              newReply
            ]
          }));

          // Update replies count
          this.allComments.update(comments =>
            comments.map(comment =>
              comment._id === commentId
                ? { ...comment, repliesCount: (comment.repliesCount || 0) + 1 }
                : comment
            )
          );

          this.loadedReplies.update(loaded => ({
            ...loaded,
            [commentId]: true
          }));

          this.expandedReplies.update(expanded => ({
            ...expanded,
            [commentId]: true
          }));

          this.replyContent.reset('');
          this.replyingTo.set(null);
        },
        error: err => console.log(err)
      });
  }

  // ---------- get replies ----------
  getReplies(commentId: string): void {
    this.commentService
      .getReplies(this.postId(), commentId)
      .subscribe({
        next: (res) => {
          this.repliesByComment.update(replies => ({
            ...replies,
            [commentId]: res.data.replies
          }));

          this.loadedReplies.update(loaded => ({
            ...loaded,
            [commentId]: true
          }));
        },
        error: err => console.log(err)
      });
  }

  // ---------- show / hide replies ----------
  toggleReplies(commentId: string): void {
    const isExpanded = this.expandedReplies()[commentId];

    this.expandedReplies.update(expanded => ({
      ...expanded,
      [commentId]: !isExpanded
    }));

    if (!isExpanded && !this.loadedReplies()[commentId]) {
      this.getReplies(commentId);
    }
  }

}