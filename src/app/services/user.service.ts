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
  private LOGIN_URL = '/rest-auth/login/';
  private LOGOUT_URL = '/rest-auth/logout/';

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
    return this.http.get<User>('/rest-auth/user/')
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
        this.getUser().subscribe((resp) => {
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
    return this.http.post(this.LOGOUT_URL, null).pipe(map(() => {
      this._logged_in.next(false);
      this._user = null;
    }));
  }

  public isLoggedIn(): Observable<boolean> {
    return this._logged_in;
  }
}
