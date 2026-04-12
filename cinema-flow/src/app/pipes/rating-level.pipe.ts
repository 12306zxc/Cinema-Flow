import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ratingLevel',
  standalone: true
})
export class RatingLevelPipe implements PipeTransform {

  transform(rating: number): string {
    if (typeof rating !== 'number') return '未知';
    if (rating >= 9) return '优秀';
    if (rating >= 7) return '良好';
    if (rating >= 5) return '一般';
    return '较差';
  }
}
