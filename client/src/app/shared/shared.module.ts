import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoursesComponent } from './components/courses/courses.component';

@NgModule({
  declarations: [CoursesComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],

  exports: [CoursesComponent],
})
export class SharedModule {}
