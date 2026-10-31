import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/comment.interface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-comments',
  imports: [ReactiveFormsModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css',
})
export class CommentsComponent implements OnInit {
  private readonly commentService = inject(CommentService);
  postId = input.required<string>();
  allComments = signal<Comment[]>([]);
  userId = signal('');

  // create
  content = new FormControl('');
  file = signal<File | null>(null);
  imgSrc = signal('');

  // update
  editingId = signal<string | null>(null);
  editContent = new FormControl('');
  editFile = signal<File | null>(null);
  editImgSrc = signal('');

  ngOnInit(): void {
    this.userId.set(JSON.parse(localStorage.getItem('user')!)._id);
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
}