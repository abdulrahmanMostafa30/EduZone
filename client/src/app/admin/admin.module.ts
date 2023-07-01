import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AddCourseComponent } from './add-course/add-course.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StudentsComponent } from './students/students.component';
import { FormsModule } from '@angular/forms';
import { EditCourseComponent } from './edit-course/edit-course.component';

@NgModule({
  declarations: [
    AddCourseComponent,
    DashboardComponent,
    StudentsComponent,
    EditCourseComponent,

  ],
  imports: [CommonModule,FormsModule, AdminRoutingModule],
})
export class AdminModule {}
