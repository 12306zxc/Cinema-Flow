import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-message-panel',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <aside class="message-panel" *ngIf="messageService.messages.length">
      <header>
        <mat-icon>chat</mat-icon>
        <span>服务消息</span>
        <button mat-icon-button (click)="messageService.clear()">
          <mat-icon>close</mat-icon>
        </button>
      </header>
      <ul>
        <li *ngFor="let msg of messageService.messages">{{ msg }}</li>
      </ul>
    </aside>
  `,
  styles: [`
    .message-panel {
      position: fixed;
      right: 16px;
      bottom: 16px;
      width: 320px;
      max-height: 240px;
      overflow-y: auto;
      background: #fffbe6;
      border: 1px solid #f0d070;
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 12px;
      z-index: 2000;
    }
    header {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 600;
    }
    header span {
      flex: 1;
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 4px 0 0;
    }
    li {
      padding: 2px 0;
      border-bottom: 1px dashed #eee;
    }
  `]
})
export class MessagePanelComponent {
  readonly messageService = inject(MessageService);
}