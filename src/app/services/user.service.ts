import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private REGISTER_URL = '/api/register/';
  private LOGIN_URL = '/api/login/';

  private _user: User;
  private _token: string;
  private _logged_in = new Subject<boolean>();

  constructor(
    private http: HttpClient
  ) { }

  get user(): User {
    return this._user;
  }

  get token(): string {
    return this._token;
  }

  public login(username: string, password: string): Observable<any> {
    return this.http.post(this.LOGIN_URL, {
      username: username,
      password: password
    }).pipe(map((resp: any) => {
      this._token = resp.token;
      this.http.get<User>('/api/user/').subscribe((resp) => {
        console.log('logged in');
        console.log(resp);
        this._user = resp;
        this._logged_in.next(true);
      });
      return resp;
    }));
  }

  public register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(this.REGISTER_URL, {
      username: username,
      email: email,
      password: password
    });
  }

  public logout() {
    this._logged_in.next(false);
    this._token = null;
    this._user = null;
  }

  public isLoggedIn(): Observable<boolean> {
    return this._logged_in;
  }
}
