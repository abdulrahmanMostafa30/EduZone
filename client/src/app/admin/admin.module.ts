import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AddCourseComponent } from './add-course/add-course.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StudentsComponent } from './students/students.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditCourseComponent } from './edit-course/edit-course.component';

@NgModule({
  declarations: [
    AddCourseComponent,
    DashboardComponent,
    StudentsComponent,
    EditCourseComponent,

  ],
  imports: [CommonModule,FormsModule, AdminRoutingModule, ReactiveFormsModule],
})
export class AdminModule {}
