import { Component } from '@angular/core';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent {
  course: any = {
    title: '',
    description: '',
    category: '',
    price: '',
    videoTitle: '',
    videoUrl: ''
  };

  videos: any[] = [];

  addCourse() {
    // Add course logic here
    console.log('Course:', this.course);
  }

  addVideo() {
    const newVideo = {
      title: this.course.videoTitle,
      url: this.course.videoUrl
    };

    this.videos.push(newVideo);

    // Clear video fields
    this.course.videoTitle = '';
    this.course.videoUrl = '';
  }

  removeVideo(index: number) {
    this.videos.splice(index, 1);
  }
  handleImageUpload(event: any) {
    const file = event.target.files[0];
    this.course.image = file;
  }
}
