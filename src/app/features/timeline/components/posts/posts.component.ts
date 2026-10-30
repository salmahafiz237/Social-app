import { Component, inject, OnInit, signal } from '@angular/core';
import { PostsService } from './services/posts.service';
import { Post } from './models/post.interface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-posts',
  imports: [ReactiveFormsModule],
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

  submitForm(e:Event):void{
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
      }
    })
  }
}
