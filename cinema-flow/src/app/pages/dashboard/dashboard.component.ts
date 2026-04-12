import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable, map } from 'rxjs';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private movieService = inject(MovieService);

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
    map(list => [...list].sort((a, b) => b.id - a.id).slice(0, 5))
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