import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { CoursesService } from '../courses.service';

@Component({
  selector: 'app-best-selling',
  templateUrl: './best-selling.component.html',
  styleUrls: ['./best-selling.component.scss'],
  // providers:  [ CoursesService ]
})

export class BestSellingComponent {

  courses: any;
  filteredCourses: any;
  searchQuery: string = '';

  constructor(private http: HttpClient) {
    this.loadJSON();
  }

  loadJSON() {
    // const coursesURL = "http://localhost:5000/api/course";
    const coursesURL = 'https://eduzone-om33.onrender.com/api/course';

    this.http.get(coursesURL).subscribe(data => {
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
}
