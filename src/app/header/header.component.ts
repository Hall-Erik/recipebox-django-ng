import { Component, OnInit } from '@angular/core';
import { UserTokenService } from '../services/user-token.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public logged_in: boolean = false;
  public username: string = '';

  constructor(
    private userToken: UserTokenService
  ) { }

  ngOnInit() {
    this.userToken.isLoggedIn().subscribe(
      val => {
        this.logged_in = val;
        if (val) {
          this.username = this.userToken.username;
        } else {
          this.username = '';
        }
      });
  }

  logout() {
    this.userToken.purgeToken();
  }
}
