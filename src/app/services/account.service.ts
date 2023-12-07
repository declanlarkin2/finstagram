import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import * as uuid from 'uuid';
import { catchError, map } from 'rxjs/operators';
import { User } from '../models/user';
import * as bcrypt from 'bcryptjs';
const jwt = require('jsonwebtoken');

@Injectable({ providedIn: 'root' })
export class AccountService {
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

  constructor(private http: HttpClient, private router: Router) {
    this.userSubject = new BehaviorSubject(
      JSON.parse(localStorage.getItem('token')!)
    );
    this.user = this.userSubject.asObservable();
  }

  public get userValue() {
    return this.userSubject.value;
  }

  login(userDetails: any): Observable<string> {
    const username = userDetails.username;
    const password = userDetails.password;

    const userDetailsForm = new FormData();
    userDetailsForm.append('username', username);

    return this.http
      .post<any>(
        'https://prod-31.uksouth.logic.azure.com:443/workflows/91ee124fe5934ec2b74e88cf8412f6a6/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=p0165V6fFzD6RthlARzccNzP3O6vdrYUPJOC2WhlxTc',
        userDetailsForm
      )
      .pipe(
        map((storedUserDetails: any) => {
          if (
            Array.isArray(storedUserDetails) &&
            storedUserDetails.length > 0
          ) {
            const storedPassword = storedUserDetails[0].password;
            const passwordsMatch = bcrypt.compareSync(password, storedPassword);
            if (passwordsMatch) {
              const expirationDate = new Date();
              expirationDate.setMinutes(expirationDate.getMinutes() + 30);

              const token = jwt.sign(
                {
                  user_id: String(storedUserDetails[0].id),
                  user: username,
                  exp: expirationDate.getTime() / 1000,
                },
                'SECRET_KEY'
              );

              localStorage.setItem('token', JSON.stringify(token));
              this.userSubject.next(token);
              return token;
            } else {
              throw 'User not found';
            }
          } else {
            throw 'User not found';
          }
        }),
        catchError((error: any) => {
          return throwError(error);
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.userSubject.next(null);
    this.router.navigate(['/account/login']);
  }

  registerUser = (userDetails: any) => {
    userDetails.append('id', uuid.v4());
    return this.http.post(
      'https://prod-03.uksouth.logic.azure.com:443/workflows/47aa53e99faa4855ab7996d4faf53b68/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=3uJYweGHSz_C-zA9fE38oDw7VvHCE6c66lpVvT2lZAo',
      userDetails
    );
  };

  updateUserDetails(userDetails: any) {
    return this.http.put(
      'https://prod-21.uksouth.logic.azure.com:443/workflows/ab3a992e578641a09340b589d3385bc1/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=CBeui2J_xlruxsa0DcKCPW5_hH5DBNAZR4GOb0f-TI4',
      userDetails
    );
  }
}
