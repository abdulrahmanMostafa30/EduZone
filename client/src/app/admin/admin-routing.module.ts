import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "../auth/auth.guard";
import { AddCourseComponent } from "./add-course/add-course.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { UsersComponent } from "./users/users.component";
import { EditCourseComponent } from "./edit-course/edit-course.component";
import { ContactUsAdminComponent } from "./contact-us-admin/contact-us-admin.component";
import { UserDetailsComponent } from "./user-details/user-details.component";
import { ReviewsComponent } from "./reviews/reviews.component";
import { HomeComponent } from "../home/home.component";

const routes: Routes = [
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "contact-us",
    component: ContactUsAdminComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "add-course",
    component: AddCourseComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit-course/:id",
    component: EditCourseComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "users",
    component: UsersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "user-details/:userId",
    component: UserDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "reviews",
    component: ReviewsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
