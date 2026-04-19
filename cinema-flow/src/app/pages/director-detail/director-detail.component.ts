import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap, catchError, of, combineLatest, map } from 'rxjs';
import { DirectorService } from '../../services/director.service';
import { MovieService } from '../../services/movie.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-director-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './director-detail.component.html',
  styleUrl: './director-detail.component.scss'
})
export class DirectorDetailComponent {
  private route = inject(ActivatedRoute);
  private directorService = inject(DirectorService);
  private movieService = inject(MovieService);
  readonly location = inject(Location);

  // 使用 paramMap 订阅获取路由参数
  readonly director$ = this.route.paramMap.pipe(
    map(params => {
      const id = Number(params.get('id'));
      const directors = [
        { id: 1, name: '克里斯托弗·诺兰', nationality: '英国/美国', birthYear: 1970, bio: '以非线性叙事和视觉奇观著称的导演，代表作包括《盗梦空间》《星际穿越》《蝙蝠侠》三部曲。' },
        { id: 2, name: '李安', nationality: '中国台湾/美国', birthYear: 1954, bio: '横跨东西方文化的大师级导演，代表作《卧虎藏龙》《少年派的奇幻漂流》《断背山》。' },
        { id: 3, name: '宫崎骏', nationality: '日本', birthYear: 1941, bio: '吉卜力工作室创始人，动画电影巨匠，代表作《千与千寻》《龙猫》《天空之城》。' },
        { id: 4, name: '王家卫', nationality: '中国香港', birthYear: 1958, bio: '以独特的视觉美学和即兴拍摄著称，代表作《花样年华》《重庆森林》《一代宗师》。' }
      ];
      return directors.find(d => d.id === id);
    })
  );

  // 获取该导演执导的电影列表
  readonly directedMovies$ = this.route.paramMap.pipe(
    switchMap(params => {
      const directorId = Number(params.get('id'));
      return this.movieService.getMovies().pipe(
        map(movies => movies.filter(m => m.directorId === directorId))
      );
    })
  );

  // 导航到上一位/下一位导演
  readonly navigation$ = this.route.paramMap.pipe(
    map(params => {
      const currentId = Number(params.get('id'));
      const directors = [
        { id: 1, name: '克里斯托弗·诺兰', nationality: '英国/美国' },
        { id: 2, name: '李安', nationality: '中国台湾/美国' },
        { id: 3, name: '宫崎骏', nationality: '日本' },
        { id: 4, name: '王家卫', nationality: '中国香港' }
      ];
      const idx = directors.findIndex(d => d.id === currentId);
      return {
        prev: idx > 0 ? directors[idx - 1] : null,
        next: idx < directors.length - 1 ? directors[idx + 1] : null
      };
    })
  );
}