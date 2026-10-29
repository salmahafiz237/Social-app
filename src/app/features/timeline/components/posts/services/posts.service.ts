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
    return this.httpClient.get(environment.baseUrl + `posts`,this.headers)
  }

  getSinglePost(posdId:string):Observable<any>{
    return this.httpClient.get(environment.baseUrl + `posts/${posdId}`, this.headers)
  }

  deletePost(posdId:string):Observable<any>{
    return this.httpClient.delete(environment.baseUrl + `posts/${posdId}`, this.headers)
  }

  createPost(data:object):Observable<any>{
    return this.httpClient.post(environment.baseUrl+ `posts`, data, this.headers)
  }
}
