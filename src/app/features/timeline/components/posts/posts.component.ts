import { Component, inject, OnInit, signal } from '@angular/core';
import { PostsService } from './services/posts.service';
import { Post } from './models/post.interface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommentsComponent } from './components/comments/comments.component';

@Component({
  selector: 'app-posts',
  imports: [ReactiveFormsModule, CommentsComponent],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css',
})
export class PostsComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  allPosts= signal<Post[]>([]);
  userId = signal('');
  file = signal<File | null>(null);
  imgSrc = signal('');
  content = new FormControl('');
  privacy = new FormControl('public');

  ngOnInit(): void {
    this.getPostsData();
    this.userId.set(JSON.parse(localStorage.getItem('user')!)._id);
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

  changeFile(e:Event):void{
    let input = e.target as HTMLInputElement;
    console.log(input.files![0])
    this.file.set(input.files![0])
    this.imgSrc.set( URL.createObjectURL(input.files![0]));
  }

  submitForm(e:Event, reset:HTMLFormElement):void{
    e.preventDefault();
    // console.log(this.content.value, this.privacy.value, this.file())
    // this.content.value;
    // this.privacy.value;
    // this.file();

    let formData = new FormData();
    if(this.content.value){
      formData.append('body', this.content.value);
    }

    if(this.file()){
      formData.append('image', this.file()!);
    }

    if(this.privacy.value){
      formData.append('privacy', this.privacy.value);
    }
    this.postsService.createPost(formData).subscribe({
      next: (res)=>{
        console.log(res);
        this.getPostsData();
      },
      error: (err)=>{
        console.log(err);
      },
      complete:() =>{
        // (e.target as HTMLFormElement).reset()
        reset.reset()
        this.imgSrc.set('')
      }
    })
  }

  deleteItem(id: string): void {
    this.postsService.deletePost(id).subscribe({
      next: (res) => {
        console.log('Delete response:', res);

        this.allPosts.update((posts) => posts.filter((post) => post._id !== id));
      },
      error: (err) => {
        console.error('Error deleting post:', err);
      }
    });
  }

  // update post
  editingPostId = signal<string | null>(null);
  editBody = new FormControl('');
  editPrivacy = new FormControl('public');
  editFile = signal<File | null>(null);
  editImgSrc = signal('');

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
}
