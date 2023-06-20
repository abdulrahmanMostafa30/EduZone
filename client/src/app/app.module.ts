import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SliderComponent } from './slider/slider.component';
import { HomeComponent } from './home/home.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CoursesComponent } from './profile/courses/courses.component';
import { FooterComponent } from './footer/footer.component';
import { ContactComponent } from './contact/contact.component';
import { BestSellingComponent } from './best-selling/best-selling.component';
import { AddCourseComponent } from './profile/courses/add-course/add-course.component';
import { InstructorComponent } from './instructor/instructor.component';
import { StudentComponent } from './student/student.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { EnrollCourseComponent } from './enroll-course/enroll-course.component';
import { HttpClientModule } from '@angular/common/http';
import { AboutComponent } from './about/about.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SliderComponent,
    HomeComponent,
    LoginFormComponent,
    ShoppingCartComponent,
    CheckoutComponent,
    CoursesComponent,
    FooterComponent,
    ContactComponent,
    BestSellingComponent,
    AddCourseComponent,
    InstructorComponent,
    StudentComponent,
    SignUpComponent,
    CourseDetailsComponent,
    EnrollCourseComponent,
    AboutComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
