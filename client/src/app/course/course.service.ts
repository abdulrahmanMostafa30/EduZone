import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ICourse } from "./course";

@Injectable({
  providedIn: "root",
})
export class CourseService {
  // private apiUrl = "http://localhost:5000/api/course";
  private apiUrl = "https://eduzone-om33.onrender.com/api/course";
  //
  constructor(private http: HttpClient) {}

  getCourses(): Observable<ICourse[]> {
    return this.http
      .get<ICourse[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }
  getCourseById(courseId: string): Observable<any> {
    const url = `${this.apiUrl}/${courseId}`;
    return this.http.get<ICourse>(url).pipe(catchError(this.handleError));
  }
  updateCourseById(
    courseId: string,
    data: any,
    file: File,
    videos: any[]
  ): Observable<ICourse> {
    console.log(file);

    const url = `${this.apiUrl}/${courseId}`;
    const postData = new FormData();
    postData.append("title", data.title);
    postData.append("description", data.description);
    postData.append("category", data.category);
    postData.append("price", data.price);
    postData.append("image", file);
    videos.forEach((video, index) => {
      postData.append(`vid[${index}][title]`, video.title);
      postData.append(`vid[${index}][url]`, video.url);
    });

    return this.http
      .patch<ICourse>(url, postData)
      .pipe(catchError(this.handleError));
  }
  addCourse(courseData: any, image:File): Observable<any> {
    const url = `${this.apiUrl}`;
    const postData = new FormData();

    postData.append("title", courseData.get('title').value);
    postData.append("description", courseData.get('description').value);
    postData.append("category", courseData.get('category').value);
    postData.append("price", courseData.get('price').value);
    postData.append("image", image);
    const videos = courseData.get('videos').value;
    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      postData.append(`vid[${i}][title]`, video.title);
      postData.append(`vid[${i}][url]`, video.url);
    }
    return this.http
      .post<any>(url, postData)
      .pipe(catchError(this.handleError));
  }
  deleteCourseById(courseId: string): Observable<ICourse> {
    const url = `${this.apiUrl}/${courseId}`;
    return this.http.delete<ICourse>(url).pipe(catchError(this.handleError));
  }
  addComment(data: any): Observable<ICourse> {
    const url = `${this.apiUrl}/comment`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = "An error occurred";
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    // console.error(errorMessage);
    return throwError(errorMessage);
  }
}
