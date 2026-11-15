
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly httpClient = inject(HttpClient);

  
getMyProfile(): Observable<any> {
  return this.httpClient.get(environment.baseUrl + 'users/profile-data');
}

getUserPosts(userId: string): Observable<any> {
  return this.httpClient.get(environment.baseUrl + `users/${userId}/posts`);
}

getBookmarks(): Observable<any> {
  return this.httpClient.get(environment.baseUrl + 'users/bookmarks');
}

uploadProfilePhoto(data: FormData): Observable<any> {
  return this.httpClient.put(environment.baseUrl + 'users/upload-photo', data);
}

}
