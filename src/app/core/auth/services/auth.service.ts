import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);

  // sign up 
  signUp(data:object):Observable<any>{
    return this.httpClient.post('https://route-posts.routemisr.com/users/signup',data);
  }

  // sign in 
  signIn(data:object):Observable<any>{
    return this.httpClient.post('https://route-posts.routemisr.com/users/signin',data);
  }
}
