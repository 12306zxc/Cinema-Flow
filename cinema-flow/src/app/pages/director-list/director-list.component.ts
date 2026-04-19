import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DirectorService } from '../../services/director.service';
@Component({
  selector: 'app-director-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './director-list.component.html',
  styleUrl: './director-list.component.scss'
})
export class DirectorListComponent {
  private directorService = inject(DirectorService);
  readonly directors$ = of([
    { id: 1, name: '克里斯托弗·诺兰', nationality: '英国/美国', birthYear: 1970, bio: '以非线性叙事和视觉奇观著称的导演，代表作包括《盗梦空间》《星际穿越》《蝙蝠侠》三部曲。' },
    { id: 2, name: '李安', nationality: '中国台湾/美国', birthYear: 1954, bio: '横跨东西方文化的大师级导演，代表作《卧虎藏龙》《少年派的奇幻漂流》《断背山》。' },
    { id: 3, name: '宫崎骏', nationality: '日本', birthYear: 1941, bio: '吉卜力工作室创始人，动画电影巨匠，代表作《千与千寻》《龙猫》《天空之城》。' },
    { id: 4, name: '王家卫', nationality: '中国香港', birthYear: 1958, bio: '以独特的视觉美学和即兴拍摄著称，代表作《花样年华》《重庆森林》《一代宗师》。' }
  ]).pipe(delay(200));

}
