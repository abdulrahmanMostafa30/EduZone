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
  getCourses(){
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
      },
      error: (error) => (this.errorMessage = error),
    });
  }
  deleteCourse(courseId:string){
    this.courseService.deleteCourseById(courseId).subscribe({
      next: (data) => {
        console.log(data);
        this.getCourses()
      },
      error: (error) => (this.errorMessage = error),
    });
  }
}
