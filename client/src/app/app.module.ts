import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SliderComponent } from './slider/slider.component';
import { HomeComponent } from './home/home.component';
import { LoginFormComponent } from './login-form/login-form.component';


import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CoursesComponent } from './profile/courses/courses.component';
import { FooterComponent } from './footer/footer.component';
import { AddCourseComponent } from './profile/courses/add-course/add-course.component';
import { InstructorComponent } from './instructor/instructor.component';
import { StudentComponent } from './student/student.component';


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
    AddCourseComponent,
    InstructorComponent,
    StudentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
