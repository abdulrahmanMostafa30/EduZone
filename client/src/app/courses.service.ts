import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  course: any;
  constructor(@Inject('paramId') private paramId: string, private http: HttpClient) {

  }


  // loadJSON() {
  //   this.http.get('https://eduzone-om33.onrender.com/course').subscribe(data => {
  //     console.log(data);
  //     return data;
  //   });

  // }
  //   getCoursesById(id:any) {
  //     this.http.get('https://eduzone-om33.onrender.com/course'+id).subscribe(data => {
  //       this.course = data;
  //     });
  //   }

}
