import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { Observable, map, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie';
import { DirectorService } from '../../services/director.service';
import { MovieSearchComponent } from '../../components/movie-search/movie-search.component';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MovieSearchComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  constructor(
    private movieService: MovieService,
    private directorService: DirectorService
  ) {}


  // 响应式统计数据（模板用 async 管道自动订阅）
  readonly stats$ = this.movieService.getMovies().pipe(
    map(list => ({
      total: list.length,
      watched: list.filter(m => m.isWatched).length,
      avgRating: list.reduce((sum, m) => sum + m.rating, 0) / (list.length || 1)
    }))
  );

  // 响应式最近电影数据（模板用 async 管道自动订阅）
  readonly recent$ = this.movieService.getMovies().pipe(
    map(list => [...list].sort((a, b) => b.id - a.id).slice(0, 6))
  );

  // 新增：人气导演
  readonly topDirectors$ = of([
    { id: 1, name: '克里斯托弗·诺兰', nationality: '英国/美国' },
    { id: 2, name: '李安', nationality: '中国台湾/美国' },
    { id: 3, name: '宫崎骏', nationality: '日本' },
    { id: 4, name: '王家卫', nationality: '中国香港' }
  ]).pipe(
    delay(200),
    map((list: any[]) => list.slice(0, 4))
  );



  // 保留你原有的删除功能
  deleteMovie(id: number): void {
    if (confirm('确定要删除这部电影吗？')) {
      this.movieService.deleteMovie(id).subscribe();
    }
  }

  // 如果你有其他需要在初始化时执行的逻辑，可以保留 ngOnInit
  ngOnInit(): void {
    // 这里不需要手动订阅了，async 管道会自动处理
  }

  ngOnDestroy(): void {
    // async 管道会自动退订，这里可以留空，也可以删除整个 ngOnDestroy
  }
}