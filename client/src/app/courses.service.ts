import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { ICourse } from './course/course';


@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  // course: any;
  // constructor(@Inject('paramId') private paramId: string, private http: HttpClient) {

  // }

  filteredCourses: any;
  searchQuery: string = '';
  // coursesURL = "http://localhost:5000/api/course";
  coursesURL = 'https://eduzone-om33.onrender.com/api/course';

  constructor(private http: HttpClient) {
    this.loadJSON();
  }

  loadJSON(): Observable<ICourse[]> {
    return this.http.get<ICourse[]>(this.coursesURL).pipe(catchError((error) => {
      return throwError(() => error.message || "server error");
    }));
  }
  getCourseById(id: any): Observable<any> {
    return this.http.get<any>(this.coursesURL + "/" + id).pipe(catchError((error) => {
      return throwError(() => error.message || "server error");
    }));
  }
}
