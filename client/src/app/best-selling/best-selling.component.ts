import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { CoursesService } from '../courses.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-best-selling',
  templateUrl: './best-selling.component.html',
  styleUrls: ['./best-selling.component.scss'],
  // providers:  [ CoursesService ]
})

export class BestSellingComponent {
  private coursesURL = environment.API_URL + '/api/course';

  courses: any;
  filteredCourses: any;
  searchQuery: string = '';

  constructor(private http: HttpClient) {
    this.loadJSON();
  }

  loadJSON() {
    this.http.get(this.coursesURL).subscribe(data => {
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
