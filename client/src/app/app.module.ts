import { APP_INITIALIZER, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { SliderComponent } from "./slider/slider.component";
import { HomeComponent } from "./home/home.component";
import { LoginFormComponent } from "./login-form/login-form.component";
import { CommonModule, PlatformLocation } from "@angular/common";
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
import { EditProfileComponent } from "./profile/edit-profile/edit-profile.component";
import { MyCoursesComponent } from "./profile/my-courses/my-courses.component";
import { SecurityComponent } from "./profile/security/security.component";
import { ForgetPasswordComponent } from "./forget-password/forget-password.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { ReviewsComponent } from "./reviews/reviews.component";
import { ErrorInterceptor } from "./interceptors/error.interceptor";
import { LocationStrategy, HashLocationStrategy } from "@angular/common";
import { Router } from "@angular/router";
import { APP_BASE_HREF } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { Routes } from "@angular/router";
import { HostService } from "./services/host.service";
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from '@abacritt/angularx-social-login';
import { environment } from "src/environments/environment";
import { SharedModule } from "./shared/shared.module";
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { VerificationComponent } from './verification/verification.component';
import { NgxPaginationModule } from "ngx-pagination";

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
    ReviewsComponent,
    VerificationComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    YouTubePlayerModule,
    NgxPayPalModule,
    SocialLoginModule,
    SharedModule,
    RecaptchaV3Module,
    NgxPaginationModule,
    AppRoutingModule,

  ],
  providers: [
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: (
        platformLocation: PlatformLocation,
        hostService: HostService
      ) => {
        return () => {
          const useHash = platformLocation.hash?.indexOf("#") > -1;
          const host =
            window.location.protocol +
            "//" +
            window.location.hostname +
            (window.location.port ? ":" + window.location.port : "") +
            (useHash ? "/#" : "");

          hostService.setHost(host);
          console.log("Host URL:", host);
        };
      },
      deps: [PlatformLocation, HostService],
      multi: true,
    },
    HostService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environment.GOOGLE_CLIENT_ID
            )
          },
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    },
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.RECAPTCHA.SITEKEY,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
