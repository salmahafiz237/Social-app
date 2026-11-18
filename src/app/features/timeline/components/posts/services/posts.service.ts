import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly httpClient = inject(HttpClient);
  headers = {
    headers:{
      'AUTHORIZATION': `Bearer ${localStorage.getItem('token')}`
    }
  }

  getAllPosts(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `posts`)
  }

  getSinglePost(posdId:string):Observable<any>{
    return this.httpClient.get(environment.baseUrl + `posts/${posdId}`)
  }

  deletePost(posdId:string):Observable<any>{
    return this.httpClient.delete(environment.baseUrl + `posts/${posdId}`)
  }

  createPost(data:object):Observable<any>{
    return this.httpClient.post(environment.baseUrl+ `posts`, data)
  }

  updatePost(postId:string, data:FormData):Observable<any>{
    return this.httpClient.put(environment.baseUrl + `posts/${postId}`, data)
  }

  likePost(postId: string): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `posts/${postId}/like`,{});
  }
  
  sharePost(postId: string, body: string): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `posts/${postId}/share`,{ body });
  }
}