import { Component, OnInit } from '@angular/core';
import { UserTokenService } from '../services/user-token.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public logged_in: boolean = false;
  
  
  constructor(
    private userToken: UserTokenService,
    public userService: UserService
  ) { }

  ngOnInit() {
    this.userToken.isLoggedIn().subscribe(
      (val) => {
        this.logged_in = val});
  }

  logout() {
    this.userToken.purgeToken();
  }
}
