import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from 'src/app/course/course.service';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent {
  constructor(private courseService: CourseService, private router: Router) {}
  selectedFile: File | undefined;

  errorMessage: any;
  course: any = {
    title: '',
    description: '',
    category: '',
    price: '',
    // vid: []
  };
  video = {'title': '', 'url': ''}
  videos: any[] = [];

  addCourse() {
    const postData = new FormData();

    postData.append("title", this.course.title);
    postData.append("description", this.course.description);
    postData.append("category", this.course.category);
    postData.append("price", this.course.price);
    if(this.selectedFile){
      postData.append("image", this.selectedFile);

    }

    console.log(postData);
    // console.log('Course:', this.course);

    this.courseService.addCourse(postData).subscribe({
      next: (response) => {
        console.log(response);

      },
      error: (error) => (this.errorMessage = error),
    });

  }

  addVideo() {

    this.videos.push(this.video);
    this.video.title = '';
    this.video.url = '';
  }

  removeVideo(index: number) {
    this.videos.splice(index, 1);
  }
  handleImageUpload(event: any) {
    this.selectedFile = event.target.files[0];

  }
}
