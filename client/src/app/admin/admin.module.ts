import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AdminRoutingModule } from "./admin-routing.module";
import { AddCourseComponent } from "./add-course/add-course.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { UsersComponent } from "./users/users.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EditCourseComponent } from "./edit-course/edit-course.component";
import { ContactUsAdminComponent } from "./contact-us-admin/contact-us-admin.component";
import { UserDetailsComponent } from "./user-details/user-details.component";
import { ReviewsComponent } from "./reviews/reviews.component";
import { SharedModule } from "../shared/shared.module";
import { NgxPaginationModule } from "ngx-pagination";

@NgModule({
  declarations: [
    AddCourseComponent,
    DashboardComponent,
    UsersComponent,
    EditCourseComponent,
    ContactUsAdminComponent,
    UserDetailsComponent,
    ReviewsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    NgxPaginationModule,
    AdminRoutingModule,
    ReactiveFormsModule,
  ],
})
export class AdminModule {}
