import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserTokenService } from './user-token.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private REGISTER_URL = '/api/register/';
  private LOGIN_URL = '/api/login/';

  private _user: User;

  constructor(
    private http: HttpClient,
    private userToken: UserTokenService
  ) { }

  get user(): User {
    return this._user;
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.LOGIN_URL, {
      username: username,
      password: password
    }).pipe(map((resp: any) => {
      this.userToken.token = resp.token;
      this.http.get<User>('/api/user/').subscribe((resp) => {
        console.log('logged in');
        console.log(resp);
        this._user = resp;
      });
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
