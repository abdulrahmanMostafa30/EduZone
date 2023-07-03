import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CourseService } from "src/app/course/course.service";

@Component({
  selector: "app-add-course",
  templateUrl: "./add-course.component.html",
  styleUrls: ["./add-course.component.scss"],
})
export class AddCourseComponent implements OnInit {
  // courseForm: FormGroup;
  // videos: FormArray;
  courseForm: FormGroup | any;

  constructor(private courseService: CourseService, private router: Router, private formBuilder: FormBuilder) {

   }

  selectedFile: File | undefined;
  ngOnInit() {
    this.courseForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      price: [null, Validators.required],
      image: [null, Validators.required],
      videos: this.formBuilder.array([])
    });
  }
  errorMessage: any;
  courseAdded = false;

  addCourse() {
    if (this.selectedFile) {
      this.courseService
        .addCourse(this.courseForm, this.selectedFile)
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
    const videos = this.courseForm.get('videos') as FormArray;
    videos.push(this.formBuilder.group({
      title: ['', Validators.required],
      url: ['', Validators.required]
    }));
  }

  removeVideo(index: number) {
    const videos = this.courseForm.get('videos') as FormArray;
    videos.removeAt(index);
  }
  handleImageUpload(event: any) {
    this.selectedFile = event.target.files[0];
  }
}
