import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

  constructor(private router: Router, private http: HttpClient) {
    this.userSubject = new BehaviorSubject(
      JSON.parse(localStorage.getItem('token')!)
    );
    this.user = this.userSubject.asObservable();
  }

  public get userValue() {
    return this.userSubject.value;
  }

  login(username: string, password: string) {
    return this.http
      .post<User>(`${environment.apiUrl}/login`, {
        username,
        password,
      })
      .pipe(
        map((token) => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('token', JSON.stringify(token));
          this.userSubject.next(token);
          return token;
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.userSubject.next(null);
    this.router.navigate(['/account/login']);
  }

  registerUser(user: User) {
    return this.http.post(`${environment.apiUrl}/registerUser`, user);
  }

  getAllUsers() {
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }

  getUserById(id: string) {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  updateUserDetails(id: string, params: any) {
    return this.http
      .put(`${environment.apiUrl}/users/updateUserDetails/${id}`, params)
      .pipe(
        map((x) => {
          // update stored user if the logged in user updated their own record
          if (id == this.userValue?.id) {
            // update local storage
            const user = { ...this.userValue, ...params };
            localStorage.setItem('user', JSON.stringify(user));

            // publish updated user to subscribers
            this.userSubject.next(user);
          }
          return x;
        })
      );
  }

  deleteUser(id: string) {
    return this.http
      .delete<User>(`${environment.apiUrl}/deleteAccount/${id}`)
      .pipe(
        map((x) => {
          // auto logout if the logged in user deleted their own record
          if (id == this.userValue?.id) {
            this.logout();
          }
          return x;
        })
      );
  }
}
