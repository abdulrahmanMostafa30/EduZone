import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProfileComponent } from "./profile.component";
import { ProfileRoutingModule } from "./profile-routing.module";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { NgxPaginationModule } from "ngx-pagination";

@NgModule({
  declarations: [ProfileComponent, SidebarComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    SharedModule,
    ProfileRoutingModule,
  ],
  exports: [
    SidebarComponent, // HERE.,
  ],
})
export class ProfileModule {}
