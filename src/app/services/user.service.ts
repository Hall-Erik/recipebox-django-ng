import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserTokenService } from './user-token.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private REGISTER_URL = '/api/register/';
  private LOGIN_URL = '/api/login/';

  constructor(
    private http: HttpClient,
    private userToken: UserTokenService
  ) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.LOGIN_URL, {
      username: username,
      password: password
    }).pipe(map((resp: any) => {
      this.userToken.username = username;
      this.userToken.token = resp.token;
      return resp;
    }));
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(this.REGISTER_URL, {
      username: username,
      email: email,
      password: password
    });
  }
}
