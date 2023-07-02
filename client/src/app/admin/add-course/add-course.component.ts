import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { CourseService } from "src/app/course/course.service";

@Component({
  selector: "app-add-course",
  templateUrl: "./add-course.component.html",
  styleUrls: ["./add-course.component.scss"],
})
export class AddCourseComponent {
  constructor(private courseService: CourseService, private router: Router) { }
  selectedFile: File | undefined;

  errorMessage: any;
  course: any = {
    title: "",
    description: "",
    category: "",
    price: "",
  };
  courseAdded = false;
  video = { title: "", url: "" };
  videos: any[] = [];

  addCourse() {
    if (this.selectedFile) {
      this.courseService
        .addCourse(this.course, this.videos, this.selectedFile)
        .subscribe({
          next: (response) => {
            this.courseAdded = true;
            setTimeout(() => {
              this.router.navigate(["/profile/admin/dashboard"]);
            }, 500);
          },
          error: (error) => (this.errorMessage = error),
        });
    }
  }

  addVideo() {
    this.videos.push(this.video);
    this.video.title = "";
    this.video.url = "";
  }

  removeVideo(index: number) {
    this.videos.splice(index, 1);
  }
  handleImageUpload(event: any) {
    this.selectedFile = event.target.files[0];
  }
}
