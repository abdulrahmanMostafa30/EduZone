import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoursesService } from '../courses.service';
// import { CoursesService } from '../courses.service';

@Component({
  selector: 'app-enroll-course',
  templateUrl: './enroll-course.component.html',
  styleUrls: ['./enroll-course.component.scss'],
  providers: [
    {
      provide: 'paramId',
      useValue: 'param-id',
    },
  ],
})
export class EnrollCourseComponent implements OnInit {
  id: any;
  course: any;
  constructor(private route: ActivatedRoute, private http: HttpClient, private coursesService: CoursesService) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.coursesService.getCourseById(this.id).subscribe((data) => {
      this.course = data;
    });
  }

  // getCourseById(id: any) {
  //   this.http.get('https://eduzone-om33.onrender.com/api/course/' + id).subscribe(data => {
  //     this.course = data;
  //     // console.log(data);
  //   });
  // }

}
