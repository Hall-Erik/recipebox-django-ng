import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private USER_URL = '/api/user/';
  private REGISTER_URL = '/api/register/';
  private LOGIN_URL = '/api/login/';
  private RESET_REQUEST_URL = '/api/password/reset/';
  private RESET_PWD_URL = '/api/password/reset/confirm/';
  private CHANGE_PWD_URL = '/api/password/change/';
  private LOGOUT_URL = '/api/logout/';

  private _user: User;
  private _logged_in = new Subject<boolean>();

  constructor(
    private http: HttpClient
  ) { }

  set logged_in(val: boolean) {
    this._logged_in.next(val);
  }

  get logged_in(): boolean {
    return this._user != null;
  }

  set user(user: User) {
    this._user = user;
  }

  get user(): User {
    return this._user;
  }

  public getUser(): Observable<User> {
    return this.http.get<User>(this.USER_URL)
      .pipe(map((resp: User) => {
        this._user = resp;
        this._logged_in.next(true);
        return resp;
      }, () => {
        this._logged_in.next(false);
        return null;
      }));
  }

  public login(username: string, password: string): Observable<any> {
    return this.http.post(this.LOGIN_URL, {
      username: username,
      password: password
    }).pipe(map((resp: any) => {
        this.getUser().subscribe();
      return resp;
    }));
  }

  public request_reset(email: string): Observable<any> {
    return this.http.post(this.RESET_REQUEST_URL, {email: email});
  }

  public reset_password(token: string, password1: string): Observable<any> {
    return this.http.post(this.RESET_PWD_URL, {
      token: token,
      password: password1,
    });
  }

  public change_password(old_password: string, new_password1: string, new_password2: string): Observable<any> {
    return this.http.post(this.CHANGE_PWD_URL, {
      old_password: old_password,
      new_password1: new_password1,
      new_password2: new_password2
    });
  }

  public register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(this.REGISTER_URL, {
      username: username,
      email: email,
      password: password
    });
  }

  public logout() {
    return this.http.post(this.LOGOUT_URL, null).pipe(map(() => {
      this._logged_in.next(false);
      this._user = null;
    }));
  }

  public isLoggedIn(): Observable<boolean> {
    return this._logged_in;
  }
}
