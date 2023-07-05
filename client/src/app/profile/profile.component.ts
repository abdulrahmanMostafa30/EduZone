import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { IUser } from './user';
import { UserService } from './user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class ProfileComponent implements OnInit {
  user: any;
  errorMessage: any;
  constructor(private userService: UserService, private router: Router, public fb: FormBuilder,) {}

  ngOnInit() {
    this.getUserMe()
    this.userService.childToParentEvent.subscribe(data => {
      this.getUserMe()
    });
  }

  getUserMe(){
    this.userService.getUserMe().subscribe({
      next: (response) => {
        if(response.status= 'success'){
          this.user = response.data.data;
          console.log(this.user);
        }
      },
      error: (error) => (this.errorMessage = error),
    });
  }

  isSubmitted = false;
  Gender: any = ['male', 'Female'];

  registrationForm = this.fb.group({
    genderType: ['', [Validators.required]],
  });
  onSubmit(): void {
    console.log(this.registrationForm);
    this.isSubmitted = true;
    if (!this.registrationForm.valid) {
      false;
    } else {
      console.log(JSON.stringify(this.registrationForm.value));
    }
  }
  updateProfileMe(): void {
    // this.userService.updateProfileMe(this.user).subscribe(
    //   (response) => {
    //     console.log('Profile updated successfully');
    //   },
    //   (error) => {
    //     console.error('Failed to update profile', error);
    //   }
    // );
  }

  onLogout() {
    // this.authService.logout();
  }
}
