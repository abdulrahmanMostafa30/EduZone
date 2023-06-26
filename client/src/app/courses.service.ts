import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  // course: any;
  // constructor(@Inject('paramId') private paramId: string, private http: HttpClient) {

  // }

  courses: any;
  filteredCourses: any;
  searchQuery: string = '';

  constructor(private http: HttpClient) {
    this.loadJSON();
  }

  loadJSON() {
    this.http.get('https://eduzone-om33.onrender.com/course').subscribe(data => {
      this.courses = data;
      this.filteredCourses = this.courses;
    });
  }
  getUniqueCategories(): string[] {
    if (!this.courses) {
      return [];
    }

    const categories = this.courses.map((course: { category: any; }) => course.category);
    return Array.from(new Set(categories));
  }

  filterCourses(category: string): void {
    this.filteredCourses = this.courses.filter((course: { category: string; }) => course.category === category);
  }

  searchCourses(): void {
    if (!this.searchQuery) {
      this.filteredCourses = this.courses;
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredCourses = this.courses.filter((course: { title: string; description: string; }) =>
        course.title.toLowerCase().includes(query) || course.description.toLowerCase().includes(query)
      );
    }
  }

  // loadJSON() {
  //   this.http.get('https://eduzone-om33.onrender.com/course').subscribe(data => {
  //     console.log(data);
  //     return data;
  //   });

  // }
  //   getCoursesById(id:any) {
  //     this.http.get('https://eduzone-om33.onrender.com/course'+id).subscribe(data => {
  //       this.course = data;
  //     });
  //   }

}
