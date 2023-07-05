import { Component } from '@angular/core';
import { ContactUsService } from '../admin/contact-us.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  messageText: string;
  email: string;
  showSuccessAlert: boolean;

  constructor(private contactService: ContactUsService) {
    this.messageText = '';
    this.email = '';
    this.showSuccessAlert = false;

  }

  sendContact() {
    // Perform validation
    if (!this.messageText || !this.email) {
      // Handle validation error, show error message, etc.
      return;
    }

    // Call the ContactUsService to send the contact message
    this.contactService.add(this.email, this.messageText).subscribe(
      (response) => {
        // Handle success, show success message, clear form fields, etc.
        console.log('Message sent successfully:', response);
        this.showSuccessAlert = true;

        this.messageText = '';
        this.email = '';
        setTimeout(() => {
          this.showSuccessAlert = false;
        }, 3000);
      },
      (error) => {
        // Handle error, show error message, etc.
        console.error('Error sending message:', error);
      }
    );
  }
}
