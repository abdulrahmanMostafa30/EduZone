import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICourse } from 'src/app/course/course';
import { CourseService } from 'src/app/course/course.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  courses: ICourse[] = [];
  errorMessage: any;
  constructor(private courseService: CourseService, private router: Router) {}
  ngOnInit() {
    this.getCourses()
  }
  gotToCourse(courseId:string){
    this.router.navigate(["/course", courseId]);
  }
  updateCourseStatus(course: ICourse){
    this.courseService.updateCourseStatus(course._id, course.active).subscribe({
      next: (data) => {
        this.getCourses()
      },
      error: (error) => (this.errorMessage = error),
    });
  }
  getCourses(){
    this.courseService.getCourses(true).subscribe({
      next: (courses) => {
        this.courses = courses;
      },
      error: (error) => (this.errorMessage = error),
    });
  }
  deleteCourse(courseId:string){
    const confirmed = confirm('Are you sure you want to delete this Course?');
    if (!confirmed) {
      return; // User canceled the deletion
    }
    this.courseService.deleteCourseById(courseId).subscribe({
      next: (data) => {
        this.getCourses()
      },
      error: (error) => (this.errorMessage = error),
    });
  }
}
