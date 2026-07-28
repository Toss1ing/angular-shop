import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../enviroment/environment.dev';
import { LoginCredentials, SingUpCredentials, User } from '../models/user';
import { Observable, of, switchMap, tap, throwError } from 'rxjs';

const AUTH_USER_KEY = 'auth_user';
const EMAIL_ATTRIBUTE = 'email';
const PASSWORD_ATTRIBUTE = 'password';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'users';

  constructor(private http: HttpClient) {}

  login(credentials: LoginCredentials): Observable<User> {
    const params = new HttpParams()
      .set(EMAIL_ATTRIBUTE, credentials.email)
      .set(PASSWORD_ATTRIBUTE, credentials.password);

    return this.http.get<User[]>(`${environment.apiUrl}/${this.API_URL}`, { params }).pipe(
      switchMap((users) => {
        if (!users.length) {
          return throwError(() => new Error('INVALID_CREDENTIALS'));
        }

        const user = users[0];
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));

        return of(user);
      }),
    );
  }

  signUp(credentials: SingUpCredentials): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/${this.API_URL}`, credentials).pipe(
      tap((user) => {
        if (!user) {
          throw new Error('Cannot create account');
        }

        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        return user;
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(AUTH_USER_KEY);
    window.location.reload();
  }

  getCurrentUser(): User | null {
    const storedUser = localStorage.getItem(AUTH_USER_KEY);

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser) as User;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
}
