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
    return this.httpClient.get(environment.baseUrl + `posts/${postId}/comments?page=1&${limit}`, this.headers)
  }
}
