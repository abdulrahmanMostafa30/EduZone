import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-best-selling',
  templateUrl: './best-selling.component.html',
  styleUrls: ['./best-selling.component.scss'],
})

export class BestSellingComponent {
  private coursesURL = environment.API_URL + '/api/course';

  courses: any;
  filteredCourses: any;
  bestSellingCourses: any;
  searchQuery: string = '';
  itemsPerPage: number = 9;
  currentPage = 1;
  pageSize = 6; // Set the number of items per page here

  constructor(private http: HttpClient) {
    this.loadJSON();
  }

  loadJSON() {
    this.http.get(this.coursesURL).subscribe(data => {
      this.courses = data;
      this.filteredCourses = this.courses;
      this.setBestSellingCourses();
    });
  }

  setBestSellingCourses(): void {
    // Assuming that the best-selling courses are the first few courses from the list
    this.bestSellingCourses = this.filteredCourses.slice(0, 2);
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
    this.setBestSellingCourses();
    this.currentPage = 0; // Reset current page to the first page when filtering
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
    this.setBestSellingCourses();
    this.currentPage = 0; // Reset current page to the first page when searching
  }

  getTotalPages(): number[] {
    const totalCourses = this.filteredCourses.length;
    const totalPages = Math.ceil(totalCourses / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, index) => index);
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  getPaginatedCourses(): any[] {
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredCourses.slice(startIndex, endIndex);
  }
}
