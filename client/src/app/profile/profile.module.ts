import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileComponent } from './profile.component';
// import { EditProfileComponent } from './edit-profile.component';
// import { SecurityComponent } from './security.component';
// import { MyCoursesComponent } from './my-courses.component';
// import { SidebarComponent } from './sidebar.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';

@NgModule({

  declarations: [
    ProfileComponent,
    SidebarComponent,
  ],
  imports: [CommonModule,FormsModule, ProfileRoutingModule],
  exports: [
    SidebarComponent // HERE.
  ]
})
export class ProfileModule {}
