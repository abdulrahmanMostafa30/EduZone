import { Component, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
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

  constructor(private route: ActivatedRoute, private courseService: CourseService) {}

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
    //   this.isSubmitted = true;
    //   if (isValid) {
    //     this.httpProvider.saveEmployee(this.editEmployeeForm).subscribe(async data => {
    //       if (data != null && data.body != null) {
    //         var resultData = data.body;
    //         if (resultData != null && resultData.isSuccess) {
    //           if (resultData != null && resultData.isSuccess) {
    //             this.toastr.success(resultData.message);
    //             setTimeout(() => {
    //               this.router.navigate(['/Home']);
    //             }, 500);
    //           }
    //         }
    //       }
    //     },
    //       async error => {
    //         this.toastr.error(error.message);
    //         setTimeout(() => {
    //           this.router.navigate(['/Home']);
    //         }, 500);
    //       });
    //   }
    // }
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
