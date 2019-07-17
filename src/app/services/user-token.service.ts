import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserTokenService {

  private _token: string = null;
  private _username: string = null;
  private _logged_in = new Subject<boolean>();

  constructor() { }

  set token(token: string) {
    this._token = token;
    this._logged_in.next(true);
  }

  get token(): string {
    return this._token;
  }

  set username(username: string) {
    this._username = username;
  }

  get username(): string {
    return this._username;
  }

  purgeToken() {
    this._token = null;
    this._username = null;
    this._logged_in.next(false);
  }

  isLoggedIn(): Observable<boolean> {
    return this._logged_in;
  }
}
