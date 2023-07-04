import { Component, ViewChild } from "@angular/core";
import { FormBuilder, NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CourseService } from "./../../course/course.service";

@Component({
  selector: "app-edit-course",
  templateUrl: "./edit-course.component.html",
  styleUrls: ["./edit-course.component.scss"],
})
export class EditCourseComponent {
  editCourseForm: CourseForm = new CourseForm();
  selectedFile: File | null = null;

  @ViewChild("courseForm")
  courseForm!: NgForm;

  isSubmitted: boolean = false;
  courseId: any;
  errorMessage: any;
  touchedVideos: boolean[] = [];

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}
  handleImageUpload(event: any) {
    this.selectedFile = event.target.files[0];
  }
  ngOnInit(): void {
    this.courseId = this.route.snapshot.params["id"];
    this.getCourseById();
  }
  getCourseById() {
    this.courseService.getCourseById(this.courseId).subscribe(
      (resultData: any) => {
        if (resultData) {
          this.editCourseForm.vid =resultData.vid
          this.editCourseForm.Id = resultData._id;
          this.editCourseForm.title = resultData.title;
          this.editCourseForm.description = resultData.description;
          this.editCourseForm.category = resultData.category;
          this.editCourseForm.price = resultData.price;
          this.editCourseForm.image = resultData.image;
        }
      },
      (error: any) => {}
    );
  }

  EditCourse(isValid: any) {
    this.isSubmitted = true;

    if (isValid) {
      this.courseService
        .updateCourseById(
          this.courseId,
          this.editCourseForm,
          this.selectedFile,
        )
        .subscribe({
          next: (response) => {
            setTimeout(() => {
              this.router.navigate(["/profile/admin/dashboard"]);
            }, 500);
          },
          error: (error) => {
            setTimeout(() => {
              this.router.navigate(["/profile/admin/dashboard"]);
            }, 500);
          },
        });
    }
  }
  addVideo() {
    this.editCourseForm.vid.push({ title: "", url: "" });
  }
  removeVideo(index: number) {
    const videosArray = this.editCourseForm.vid;
    if (videosArray.length > 1) {
      videosArray.splice(index, 1);
    }
  }
  isVideoTitleInvalid(index: number): boolean {
    return this.touchedVideos[index] && !this.editCourseForm.vid[index].title;
  }

  isVideoUrlInvalid(index: number): boolean {
    return this.touchedVideos[index] && !this.editCourseForm.vid[index].url;
  }
}
export class CourseForm {
  Id: string = "";
  title: string = "";
  description: string = "";
  category: string = "";
  price: string = "";
  image: string = "";
  vid: any[] = [];
}
