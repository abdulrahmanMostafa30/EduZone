import { Component, OnInit } from '@angular/core';
import { ContactUsService } from '../../services/contact-us.service';

@Component({
  selector: 'app-contact-us-admin',
  templateUrl: './contact-us-admin.component.html',
  styleUrls: ['./contact-us-admin.component.scss']
})
export class ContactUsAdminComponent implements OnInit {
  contactMessages: any[];

  constructor(private contactUsService: ContactUsService) {
    this.contactMessages = [];
  }

  ngOnInit() {
    this.loadContactMessages();
  }

  loadContactMessages() {
    this.contactUsService.allContacts().subscribe(
      (response) => {
        this.contactMessages = response.data;
      },
      (error) => {
        console.error('Error loading contact messages:', error);
      }
    );
  }

  removeMessage(message: any) {
    const confirmed = confirm('Are you sure you want to delete this Message?');
    if (!confirmed) {
      return; // User canceled the deletion
    }
    const contactId = message._id; // Assuming the message object has an _id property
    this.contactUsService.delete(contactId).subscribe(
      () => {
        const index = this.contactMessages.indexOf(message);
        if (index !== -1) {
          this.contactMessages.splice(index, 1);
        }
      },
      (error) => {
        console.error('Error deleting contact message:', error);
      }
    );
  }
}
