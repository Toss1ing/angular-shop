import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LoginCredentials, LoginUser, SingUpCredentials, User } from '../models/user';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroment/environment.dev';

const EMAIL_ATTRIBUTE: string = 'email';

@Injectable({
  providedIn: 'root',
})
export class AuthDataService {
  private API_URL: string = 'users';

  constructor(private http: HttpClient) {}

  getUsers(loginCredentials: LoginCredentials): Observable<LoginUser[]> {
    const params = new HttpParams()
      .set(EMAIL_ATTRIBUTE, loginCredentials.email)

    return this.http.get<LoginUser[]>(
      `${environment.apiUrl}/${this.API_URL}`,
      { params }
    );
  }

  createUser(singUpCredentials: SingUpCredentials) : Observable<User> {
    return this.http.post<User> (
      `${environment.apiUrl}/${this.API_URL}`,
      singUpCredentials
    );
  }

}
