import { Injectable } from '@angular/core';
import { LoginCredentials, SingUpCredentials, User } from '../models/user';
import { Observable, of, switchMap, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthDataService } from './auth-data.service';
import { Exception } from '../../products/models/exception';

const AUTH_USER_KEY = 'auth_user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private authDataService: AuthDataService,
    private router: Router,
  ) {}

  login(credentials: LoginCredentials): Observable<User> {
    return this.authDataService.getUsers(credentials).pipe(
      switchMap((users) => {
        if (!users.length) {
          return throwError(() => new Error(Exception.INVALID_CREDENTIALS));
        }

        const findUser = users.find(
          (user) => user.password === credentials.password
        );

        if(!findUser) {
          return throwError(() => new Error(Exception.INVALID_CREDENTIALS));
        }

        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(findUser));

        return of(findUser);
      }),
    );
  }

  signUp(signUpCredentials: SingUpCredentials): Observable<User> {
    return this.authDataService.createUser(signUpCredentials).pipe(
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
    this.router.navigate(['/']);
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
