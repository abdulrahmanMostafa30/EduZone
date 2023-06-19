import { Component } from '@angular/core';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {

  displaySelectedImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imgElement = document.getElementById('photo') as HTMLImageElement;
        imgElement.src = e.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

}
