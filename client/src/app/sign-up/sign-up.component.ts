import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  constructor(private fb: FormBuilder){ }
// using form builder services
  registerationForm =this.fb.group({
    imgUser: [''],
    fname: ['', [Validators.required, Validators.minLength(3)]],
    lname: ['', [Validators.required, Validators.minLength(3)]],
    fullName: ['',[Validators.required, Validators.pattern(/^[A-Za-z]+\s[A-Za-z]+\s[A-Za-z]+\s[A-Za-z]+$/)]],
    birthDate: ['',[Validators.required]],
    email: ['', [Validators.required, Validators.pattern(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/) ]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    country: ['', [Validators.required]],
    address:['', [Validators.required]],
    university:['', [Validators.required]],
    faculty:['', [Validators.required]],
    department: [''],
    note: ['']

  })

  get fname() {
    return this.registerationForm.get('fname');
  }
  get lname() {
    return this.registerationForm.get('lname');
  }
  get fullName() {
    return this.registerationForm.get('fullName');
  }
  get birthDate() {
    return this.registerationForm.get('birthDate');
  }
  get email() {
    return this.registerationForm.get('email');
  }
  get password() {
    return this.registerationForm.get('password');
  }
  get confirmPassword() {
    return this.registerationForm.get('confirmPassword');
  }
  get address() {
    return this.registerationForm.get('address');
  }
  get university() {
    return this.registerationForm.get('university');
  }
  get faculty() {
    return this.registerationForm.get('faculty');
  }
  displaySelectedImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imgElement = document.getElementById('photo') as HTMLImageElement;
        imgElement.src = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  ngOnInit() : void {

  }

  // getData() {
  //   this.registerationForm.patchValue({
  //   fname: 'Lamia',
  //   lname: 'Selim',
  //   fullName: 'Lamiaa Abdelmonem MahmoudSelim',
  //   birthDate: '1996-11-23',
  //   email: 'lamiaaselim1896@gmail.com',
  //   password: '2311',
  //   confirmPassword: '2311',
  //   country: '1',
  //   address: 'Menofia',
  //   university: 'Menofia',
  //   faculty: 'Education',
  //   department: 'Technology',
  //   note: 'no'
  //   })
  // }

}


// Validators.pattern(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
