import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ICourse } from "../course/course";
import { ErrorHandlingService } from "./error-handling.service";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: "root",
})
export class CourseService {
  private apiUrl = environment.API_URL + '/api/course';

  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
  ) {}

  getCourses(authenticated: boolean = false): Observable<ICourse[]> {
    return this.http
      .get<ICourse[]>(this.apiUrl)
      .pipe(
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }

  updateCourseStatus(courseId: string, active: boolean): Observable<any> {
    const url = `${this.apiUrl}/${courseId}/status`;

    return this.http.put(url, { active }).pipe(
      catchError((error) => this.errorHandlingService.handleError(error))
    );
  }
  getCourseById(courseId: string): Observable<any> {
    const url = `${this.apiUrl}/${courseId}`;
    return this.http.get<ICourse>(url).pipe(
      catchError((error) => this.errorHandlingService.handleError(error))
    );
  }
  getMyCourses(): Observable<any> {
    const url = `${this.apiUrl}/my-courses`;
    return this.http.get<ICourse>(url).pipe(
      catchError((error) => this.errorHandlingService.handleError(error))
    );
  }
  getUserCourses(userId: string): Observable<any> {
    const url = `${this.apiUrl}/user/${userId}/courses`;
    return this.http.get<ICourse>(url).pipe(
      catchError((error) => this.errorHandlingService.handleError(error))
    );
  }
  updateCourseById(
    courseId: string,
    data: any,
    file: File | null = null
  ): Observable<ICourse> {

    const url = `${this.apiUrl}/${courseId}`;
    const postData = new FormData();
    const videos = data.vid;
    postData.append("title", data.title);
    postData.append("description", data.description);
    postData.append("category", data.category);
    postData.append("price", data.price);
    if (!file) {
      postData.append("imagePath", data.image);
    } else {
      postData.append("image", file);
    }
    if (videos) {
      videos.forEach((video: any, index: number) => {
        postData.append(`vid[${index}][title]`, video.title);
        postData.append(`vid[${index}][url]`, video.url);
      });
    }

    return this.http
      .patch<ICourse>(url, postData)
      .pipe(
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }
  addCourse(courseData: any, image: File): Observable<any> {
    const url = `${this.apiUrl}`;
    const postData = new FormData();

    postData.append("title", courseData.get("title").value);
    postData.append("description", courseData.get("description").value);
    postData.append("category", courseData.get("category").value);
    postData.append("price", courseData.get("price").value);
    postData.append("image", image);
    const videos = courseData.get("videos").value;
    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      postData.append(`vid[${i}][title]`, video.title);
      postData.append(`vid[${i}][url]`, video.url);
    }
    return this.http
      .post<any>(url, postData)
      .pipe(
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }
  deleteCourseById(courseId: string): Observable<ICourse> {
    const url = `${this.apiUrl}/${courseId}`;
    return this.http.delete<ICourse>(url) .pipe(
      catchError((error) => this.errorHandlingService.handleError(error))
    );
  }
  addComment(data: any): Observable<ICourse> {
    const url = `${this.apiUrl}/comment`;
    return this.http
      .post<any>(url, data)
      .pipe(
        catchError((error) => this.errorHandlingService.handleError(error))
      );
  }

}
