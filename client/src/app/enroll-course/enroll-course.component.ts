import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CoursesService } from "../courses.service";
import { CartService } from "../shopping-cart/cart.service";
import { UserService } from "../profile/user.service";
import { AuthService } from "../auth/auth.service";
// import { CoursesService } from '../courses.service';

@Component({
  selector: "app-enroll-course",
  templateUrl: "./enroll-course.component.html",
  styleUrls: ["./enroll-course.component.scss"],
  providers: [
    {
      provide: "paramId",
      useValue: "param-id",
    },
  ],
})
export class EnrollCourseComponent implements OnInit {
  id: any;
  course: any;
  isEnrolled = false;
  buttonLabel = "Enroll";
  user: any;
  isAuthenticated = false;
  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService,
    private router: Router,
    private cartService: CartService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    this.coursesService.getCourseById(this.id).subscribe((data) => {
      this.course = data;
      if (this.authService.getIsAuth()) {
        this.isAuthenticated = true;
      }
      if (this.isAuthenticated) {
        this.userService.getUserMe().subscribe((responseUser) => {
          this.user = responseUser;
          console.log(this.user.data.data.cart);

          if (this.user.data.data.cart.includes(this.course._id)) {
            this.isEnrolled = true;
            this.buttonLabel = "Enrolled";
            setTimeout(() => {
              this.router.navigate(["course/enroll", this.course._id]);
            }, 500);
          }
        });
      }
      else{
        this.buttonLabel = "Login to Enroll";
      }
    });
  }
  enroll() {
    if(this.isAuthenticated){
      this.isEnrolled = true;
      this.buttonLabel = "Enrolled";

      this.cartService.add(this.course._id).subscribe({
        next: (response) => {
          setTimeout(() => {
            this.router.navigate(["course/enroll", this.course._id]);
          }, 500);
        },
        error: (error) => {
          // setTimeout(() => {
          //   this.router.navigate(["shopping-cart"]);
          // }, 500);
        },
      });
    }
    else{
      setTimeout(() => {
        this.router.navigate(["login"]);
      }, 500);
    }

  }
}
