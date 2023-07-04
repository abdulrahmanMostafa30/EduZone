import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ContactComponent } from "./contact/contact.component";
import { BestSellingComponent } from "./best-selling/best-selling.component";
import { CheckoutComponent } from "./checkout/checkout.component";
import { EnrollCourseComponent } from "./enroll-course/enroll-course.component";
import { CourseDetailsComponent } from "./course-details/course-details.component";
import { LoginFormComponent } from "./login-form/login-form.component";
import { SignUpComponent } from "./sign-up/sign-up.component";

import { HomeComponent } from "./home/home.component";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import { ShoppingCartComponent } from "./shopping-cart/shopping-cart.component";
import { AuthGuard } from "./auth/auth.guard";
import { AuthService } from "./auth/auth.service";
import { EditProfileComponent } from "./profile/edit-profile/edit-profile.component";
import { MyCoursesComponent } from "./profile/my-courses/my-courses.component";
import { SecurityComponent } from "./profile/security/security.component";
import { ForgetPasswordComponent } from "./forget-password/forget-password.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "login", component: LoginFormComponent },
  { path: "forget-password", component: ForgetPasswordComponent },
  { path: "reset-password/:token", component: ResetPasswordComponent },
  { path: "signup", component: SignUpComponent },
  { path: "contact", component: ContactComponent },
  {
    path: "course/enroll/:id",
    component: CourseDetailsComponent,
    canActivate: [AuthGuard],
  },
  { path: "course/:id", component: EnrollCourseComponent },
  {
    path: "profile",
    loadChildren: () =>
      import("./profile/profile.module").then((m) => m.ProfileModule),
  },

  { path: "checkout", component: CheckoutComponent, canActivate: [AuthGuard] },
  {
    path: "shopping-cart",
    component: ShoppingCartComponent,
    canActivate: [AuthGuard],
  },
  // { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
  providers: [AuthService, AuthGuard],
})
export class AppRoutingModule {}
