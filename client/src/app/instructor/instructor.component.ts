import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
// import { AdminService } from 'src/app/services/admin.service';
// import { UserService } from 'src/app/services/user.service';

@Component({
  selector: "app-instructor",
  templateUrl: "./instructor.component.html",
  styleUrls: ["./instructor.component.scss"],
})
export class InstructorComponent implements OnInit {
  isSubmitted = false;
  Gender: any = ['male', 'Female'];
  constructor(public fb: FormBuilder) {}
  registrationForm = this.fb.group({
    genderType: ['', [Validators.required]],
  });
  changeGender(e: any) {
    this.genderType?.setValue(e.target.value, {
      onlySelf: true,
    });
  }
  // Access formcontrols getter
  get genderType() {
    return this.registrationForm.get('genderType');
  }
  onSubmit(): void {
    console.log(this.registrationForm);
    this.isSubmitted = true;
    if (!this.registrationForm.valid) {
      false;
    } else {
      console.log(JSON.stringify(this.registrationForm.value));
    }
  }

  ngOnInit(): void {}
}
