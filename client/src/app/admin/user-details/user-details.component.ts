import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CourseService } from "src/app/course/course.service";
import { UserService } from "src/app/profile/user.service";

@Component({
  selector: "app-user-details",
  templateUrl: "./user-details.component.html",
  styleUrls: ["./user-details.component.scss"],
})
export class UserDetailsComponent implements OnInit {
  userId: string | null = "";
  user: any;
  courses: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private courseService: CourseService
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get("userId");
    this.getUserDetails();
    this.getUserDetails();
  }

  getUserDetails() {
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe(
        (response) => {
          if (response.status === "success") {
            this.user = response.data.data;
          }
        },
        (error) => {
          console.error("Error getting user details:", error);
        }
      );
    }
  }

  getUserCourses() {
    // this.courseService.getCoursesByStudentId(this.studentId).subscribe(
    //   (response) => {
    //     if (response.status === 'success') {
    //       this.courses = response.data;
    //     }
    //   },
    //   (error) => {
    //     console.error('Error getting student courses:', error);
    //   }
    // );
  }
}
