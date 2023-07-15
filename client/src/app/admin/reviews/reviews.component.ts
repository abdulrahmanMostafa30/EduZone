import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ICourse } from "src/app/course/course";
import { CourseService } from "src/app/services/course.service";

@Component({
  selector: "app-reviews",
  templateUrl: "./reviews.component.html",
  styleUrls: ["./reviews.component.scss"],
})
export class ReviewsComponent implements OnInit {
  currentPage = 1;
  pageSize = 5; // Set the number of items per page here

  courses: any[] = [];
  errorMessage: any;
  constructor(private courseService: CourseService, private router: Router) {}
  ngOnInit() {
    this.getCourses();
  }
  gotToCourse(courseId: string) {
    this.router.navigate(["/course", courseId]);
  }
  getCourses() {
    this.courseService.getCourses(true).subscribe({
      next: (courses) => {
        this.courses = courses;
      },
      error: (error) => (this.errorMessage = error),
    });
  }
  deleteReview(courseId: string, reviewIndex: number) {
    const confirmed = confirm('Are you sure you want to delete this Review?');
    if (!confirmed) {
      return; // User canceled the deletion
    }
    const course = this.courses.find((c) => c._id === courseId);

    if (course) {
      course.comments.splice(reviewIndex, 1);
    }
    this.courseService.updateCourseById(courseId, {'comments': course['comments']}).subscribe({
      next: (data) => {
        this.getCourses()
      },
      error: (error) => (this.errorMessage = error),
    });

  }
}
