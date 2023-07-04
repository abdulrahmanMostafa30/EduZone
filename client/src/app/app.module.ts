import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { SliderComponent } from "./slider/slider.component";
import { HomeComponent } from "./home/home.component";
import { LoginFormComponent } from "./login-form/login-form.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { ShoppingCartComponent } from "./shopping-cart/shopping-cart.component";
import { CheckoutComponent } from "./checkout/checkout.component";
import { FooterComponent } from "./footer/footer.component";
import { ContactComponent } from "./contact/contact.component";
import { BestSellingComponent } from "./best-selling/best-selling.component";
import { StudentComponent } from "./student/student.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { CourseDetailsComponent } from "./course-details/course-details.component";
import { EnrollCourseComponent } from "./enroll-course/enroll-course.component";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AboutComponent } from "./about/about.component";
import { ReactiveFormsModule } from "@angular/forms";
import { YouTubePlayerModule } from "@angular/youtube-player";
import { NgxPayPalModule } from "ngx-paypal";
import { JWT_OPTIONS, JwtHelperService } from "@auth0/angular-jwt";
import { AuthService } from "./auth/auth.service";
import { AuthInterceptor } from "./auth/auth-interceptor";
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { MyCoursesComponent } from './profile/my-courses/my-courses.component';
import { SecurityComponent } from './profile/security/security.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SliderComponent,
    HomeComponent,
    LoginFormComponent,
    ShoppingCartComponent,
    CheckoutComponent,
    FooterComponent,
    ContactComponent,
    BestSellingComponent,
    StudentComponent,
    SignUpComponent,
    CourseDetailsComponent,
    EnrollCourseComponent,
    AboutComponent,
    EditProfileComponent,
    MyCoursesComponent,
    SecurityComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    YouTubePlayerModule,
    NgxPayPalModule,
  ],
  providers: [
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }

  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
