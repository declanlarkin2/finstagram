import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AccountService } from '../services/account.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private accountService: AccountService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to the api url
    const user = this.accountService.userValue;
    const isLoggedIn = user && user.token;

    if (isLoggedIn) {
      request = request.clone({
        setHeaders: {
          'x-access-token': `${user.token}`,
        },
      });
    } else {
      request = request.clone({
        setHeaders: {
          'x-access-token': '',
        },
      });
    }

    return next.handle(request);
  }
}
