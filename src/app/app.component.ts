import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'recipebox';

  constructor(private userService: UserService) {}

  ngOnInit() {
    // try to fetch user from server
    // if successful, it means the user is logged in.
    this.userService.getUser().subscribe();
  }
}
