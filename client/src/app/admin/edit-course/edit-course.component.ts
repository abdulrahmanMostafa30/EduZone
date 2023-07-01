import { Component, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-edit-course",
  templateUrl: "./edit-course.component.html",
  styleUrls: ["./edit-course.component.scss"],
})
export class EditCourseComponent {
  editEmployeeForm: employeeForm = new employeeForm();

  @ViewChild("employeeForm")
  employeeForm!: NgForm;

  isSubmitted: boolean = false;
  employeeId: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // this.employeeId = this.route.snapshot.params['employeeId'];
    // this.getEmployeeDetailById();
  }
  getEmployeeDetailById() {
    // this.httpProvider.getEmployeeDetailById(this.employeeId).subscribe((data: any) => {
    //   if (data != null && data.body != null) {
    //     var resultData = data.body;
    //     if (resultData) {
    //       this.editEmployeeForm.Id = resultData.id;
    //       this.editEmployeeForm.FirstName = resultData.firstName;
    //       this.editEmployeeForm.LastName = resultData.lastName;
    //       this.editEmployeeForm.Email = resultData.email;
    //       this.editEmployeeForm.Address = resultData.address;
    //       this.editEmployeeForm.Phone = resultData.phone;
    //     }
    //   }
    // },
    //   (error: any) => { });
  }

  EditEmployee(isValid: any) {
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
export class employeeForm {
  Id: number = 0;
  FirstName: string = "";
  LastName: string = "";
  Email: string = "";
  Address: string = "";
  Phone: string = "";
}
