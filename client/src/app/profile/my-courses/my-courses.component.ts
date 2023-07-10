import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-my-courses',
  templateUrl: './my-courses.component.html',
  styleUrls: ['./my-courses.component.scss']
})
export class MyCoursesComponent implements OnInit {
  user:any
  errorMessage:any
  constructor(private userService:UserService){

  }
  getUserMe() {
    this.userService.getUserMe().subscribe({
      next: (response) => {
        if ((response.status = "success")) {
          this.user = response.data.data;
        }
      },
      error: (error) => (this.errorMessage = error),
    });
  }
  ngOnInit(){
    this.getUserMe()
  }
}
