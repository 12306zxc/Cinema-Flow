import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rating-level',
  standalone: true,
  imports: [],
  templateUrl: './rating-level.component.html',
  styleUrls: ['./rating-level.component.scss']
})
export class RatingLevelComponent {
  @Input() rating: number = 0;

  getLevel(): string {
    if (this.rating >= 9) return '优秀';
    if (this.rating >= 7) return '良好';
    if (this.rating >= 5) return '一般';
    return '较差';
  }

  getClass(): string {
    if (this.rating >= 9) return 'excellent';
    if (this.rating >= 7) return 'good';
    if (this.rating >= 5) return 'average';
    return 'poor';
  }
}
