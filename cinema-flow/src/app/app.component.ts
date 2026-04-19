import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { AuthService } from './services/auth.service';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    BreadcrumbComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'cinema-flow';
  authService: any = inject(AuthService);
  private dialog = inject(MatDialog);
  
  showLogin(): void {
    const username = prompt('请输入用户名:');
    const password = prompt('请输入密码:');
    if (username && password) {
      this.authService.login(username, password);
    }
  }
}
