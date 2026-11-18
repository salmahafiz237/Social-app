import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly httpClient = inject(HttpClient);

  headers = {
    headers:{
      'AUTHORIZATION': `Bearer ${localStorage.getItem('token')}`
    }
  }


  getAllComments(postId:string, limit:number=10):Observable<any>{
    return this.httpClient.get(environment.baseUrl + `posts/${postId}/comments?page=1&${limit}`)
  }

  createComment(postId:string, data:FormData):Observable<any>{
    return this.httpClient.post(environment.baseUrl + `posts/${postId}/comments`, data)
  }

  updateComment(postId:string, commentId:string, data:FormData):Observable<any>{
    return this.httpClient.put(environment.baseUrl + `posts/${postId}/comments/${commentId}`, data)
  }

  deleteComment(postId:string, commentId:string):Observable<any>{
    return this.httpClient.delete(environment.baseUrl + `posts/${postId}/comments/${commentId}`)
  }

  likeComment(postId: string, commentId: string): Observable<any> {
    return this.httpClient.put(
      environment.baseUrl + `posts/${postId}/comments/${commentId}/like`,
      {},
      this.headers
    );
  }
  
  createReply(postId: string, commentId: string, data: FormData): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `posts/${postId}/comments/${commentId}/replies`,data);
  }
  
  getReplies(postId: string, commentId: string, page: number = 1, limit: number = 10):Observable<any> {
    return this.httpClient.get(environment.baseUrl + `posts/${postId}/comments/${commentId}/replies?page=${page}&limit=${limit}`);
  }
}
