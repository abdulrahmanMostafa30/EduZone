import { Component, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router} from "@angular/router";
import { CourseService } from './../../course/course.service';

@Component({
  selector: "app-edit-course",
  templateUrl: "./edit-course.component.html",
  styleUrls: ["./edit-course.component.scss"],
})
export class EditCourseComponent {
  editCourseForm: CourseForm = new CourseForm();

  @ViewChild("courseForm")
  courseForm!: NgForm;

  isSubmitted: boolean = false;
  courseId: any;
  errorMessage:any;
  constructor(private route: ActivatedRoute, private courseService: CourseService, private router: Router) {}

  ngOnInit(): void {
    this.courseId = this.route.snapshot.params['id'];
    this.getCourseById();
  }
  getCourseById() {
    this.courseService.getCourseById(this.courseId).subscribe((resultData: any) => {
        if (resultData) {
          this.editCourseForm.Id = resultData._id;
          this.editCourseForm.title = resultData.title;
          this.editCourseForm.description = resultData.description;
          this.editCourseForm.category = resultData.category;
          this.editCourseForm.price = resultData.price;
          this.editCourseForm.image = resultData.image;
      }
    },
      (error: any) => { });
  }

  EditCourse(isValid: any) {
      this.isSubmitted = true;
      if (isValid) {
        this.courseService.updateCourseById(this.courseId, this.editCourseForm)
        .subscribe({next: (response) => {
            setTimeout(() => {
                this.router.navigate(['/profile/admin/dashboard']);
              }, 500);
          },
          error: (error) =>{
                        setTimeout(() => {
              this.router.navigate(['/profile/admin/dashboard']);
            }, 500);
    }
  })
}
}

}
export class CourseForm {
  Id: string = "";
  title: string = "";
  description: string = "";
  category: string = "";
  price: string = "";
  image: string = "";
  // vid: Array = [ ];
}
