import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ContactComponent } from "./contact/contact.component";
import { BestSellingComponent } from "./best-selling/best-selling.component";
import { CheckoutComponent } from "./checkout/checkout.component";
import { EnrollCourseComponent } from "./enroll-course/enroll-course.component";
import { CourseDetailsComponent } from "./course-details/course-details.component";
import { InstructorComponent } from "./instructor/instructor.component";
import { LoginFormComponent } from "./login-form/login-form.component";
import { SignUpComponent } from "./sign-up/sign-up.component";

import { HomeComponent } from "./home/home.component";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import { ShoppingCartComponent } from "./shopping-cart/shopping-cart.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "login", component: LoginFormComponent },
  { path: "signup", component: SignUpComponent },
  { path: "contact", component: ContactComponent },
  { path: "course/:nameCourse", component: CourseDetailsComponent},
  { path: "instructor-dashboard", component: InstructorComponent },
  { path: "checkout", component: CheckoutComponent },
  { path: "shopping-cart", component: ShoppingCartComponent },
  // { path: "**", component: PageNotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
