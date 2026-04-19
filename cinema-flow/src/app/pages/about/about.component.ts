import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  private messageService = inject(MessageService);
  
  get latestMessage(): string | null {
    return this.messageService.messages[this.messageService.messages.length - 1] || null;
  }

}
