import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ProfileComponent } from "./profile.component";
import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { AuthGuard } from "../auth/auth.guard";
import { SecurityComponent } from "./security/security.component";
import { MyCoursesComponent } from "./my-courses/my-courses.component";
import { HomeComponent } from "../home/home.component";

const routes: Routes = [
  {
    path: "",
    component: ProfileComponent,
    children: [
      {
        path: "admin",
        loadChildren: () =>
          import("../admin/admin.module").then((m) => m.AdminModule),
      },
      {
        path: "edit",
        component: EditProfileComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "security",
        component: SecurityComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "courses",
        component: MyCoursesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "",
        redirectTo: "edit",
        pathMatch: "full",
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
