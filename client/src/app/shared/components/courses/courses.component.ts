import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent {
  @Input() user: any; // Adjust the type of 'user' as per your requirements
  getUserCourseProgress(user: any, courseId: string): number {
    const courseProgress = user.courseProgress.find((progress: any) => progress.courseId === courseId);
    return courseProgress ? courseProgress.currentVideoIndex  : 0;
  }
  constructor(){

  }
}
