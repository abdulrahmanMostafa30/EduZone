import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CartService } from "../services/cart.service";
import { UserService } from "../services/user.service";
import { AuthService } from "../auth/auth.service";
import { CourseService } from "../services/course.service";

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
  buttonLabel = "Add to cart";
  user: any;
  isAuthenticated = false;
  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private router: Router,
    private cartService: CartService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    this.courseService.getCourseById(this.id).subscribe((data) => {
      this.course = data;
      if (this.authService.getIsAuth()) {
        this.isAuthenticated = true;
      }
      if (this.isAuthenticated) {
        this.userService.getUserMe().subscribe((responseUser) => {
          this.user = responseUser.data.data;
          const isCoursePurchased = this.user.purchasedCourses.some(
            (course: any) => course.courseId._id === this.course._id
          );
          if (isCoursePurchased) {
            this.buttonLabel = "Go to course now";
          } else {
            if (this.user.cart) {
              if (this.user.cart.includes(this.course._id)) {
                this.isEnrolled = true;
                this.buttonLabel = "Go to cart";
              }
            }
          }
        });
      } else {
        this.buttonLabel = "Login to Enroll";
      }
    });
  }
  enroll() {
    if (this.isAuthenticated) {
      if (this.buttonLabel == "Add to cart") {
        this.cartService.add(this.course._id).subscribe({
          next: (response) => {
            this.buttonLabel = "Go to cart";
          },
          error: (error) => {
          },
        });
      }
      if (this.buttonLabel == "Go to cart") {
        this.router.navigate(["shopping-cart"]);
      }
      if (this.buttonLabel == "Go to course now") {
        this.router.navigate(["course/enroll", this.course._id]);
      }
      if (this.buttonLabel ==  "Login to Enroll") {
        this.router.navigate(["/login"]);
      }
    }
    else {
      this.router.navigate(["/login"]);
    }
  }

}
