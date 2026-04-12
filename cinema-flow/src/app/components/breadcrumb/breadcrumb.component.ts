import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs/operators';

interface BreadcrumbItem {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent {
  private router = inject(Router);
  breadcrumbs: BreadcrumbItem[] = [];
  private routeLabels: { [key: string]: string } = {
    'dashboard': '首页',
    'movies': '电影列表',
    'add': '添加电影',
    'about': '关于'
  };
  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = this.buildBreadcrumbs();
      });
  }
  private buildBreadcrumbs(): BreadcrumbItem[] {
    const url = this.router.url;
    const segments = url.split('/').filter(s => s);
    const breadcrumbs: BreadcrumbItem[] = [];
    let currentUrl = '';
    for (const segment of segments) {
      // 跳过查询参数
      if (segment.includes('?')) break;
      currentUrl += `/${segment}`;
      // 如果是数字ID，显示为"详情"
      const label = /^\d+$/.test(segment)
        ? '详情'
        : this.routeLabels[segment] || segment;
      breadcrumbs.push({ label, url: currentUrl });
    }
    return breadcrumbs;
  }

}
