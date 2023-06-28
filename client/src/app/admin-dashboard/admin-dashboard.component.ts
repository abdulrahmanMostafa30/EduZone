import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
// import { AdminService } from 'src/app/services/admin.service';
// import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  ngOnInit(): void
  {
    // this.form = new FormGroup({
    //   title: new FormControl (null),
    //   description:new FormControl (null),
    //   category:new FormControl (null),
    //   price:new FormControl (null),
    //   image:new FormControl (null),
    //   vid:new FormControl (null),
    // });
  }
  onSubmit(){
    console.log("done");
  }
}

