import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Movie } from '../../models/movie';
import { MovieService } from '../../services/movie.service';

/**
 * MovieStats 组件 - 影库统计面板
 *
 * 功能：展示影库的统计信息，包括总片量、已观影比例、平均评分等
 * 特性：使用 Observable 流和 async 管道实现数据订阅，当服务中的 movies 数据变化时 UI 自动刷新
 */
@Component({
  selector: 'app-movie-stats',
  standalone: true,
  // 显式导入 CommonModule，用于 ngIf、管道等基础功能
  imports: [
    CommonModule,
    DecimalPipe
  ],
  templateUrl: './movie-stats.component.html',
  styleUrl: './movie-stats.component.scss'
})
export class MovieStatsComponent implements OnInit {
  /**
   * 电影数据的 Observable 流
   */
  movies$: Observable<Movie[]>;

  /**
   * 构造函数注入 MovieService
   */
  constructor(private movieService: MovieService) {
    // 初始化 movies$
    this.movies$ = this.movieService.getMovies();
  }

  /**
   * 组件初始化时获取电影数据
   */
  ngOnInit(): void {
    // 重新获取数据以确保最新
    this.movies$ = this.movieService.getMovies();
  }

  /**
   * 计算已观影数量
   * @param movies 电影数组
   * @returns 已观影电影数量
   */
  getWatchedCount(movies: Movie[]): number {
    return movies.filter(m => m.isWatched).length;
  }

  /**
   * 计算已观影比例
   * @param movies 电影数组
   * @returns 已观影比例（百分比）
   */
  getWatchedPercentage(movies: Movie[]): number {
    if (movies.length === 0) return 0;
    return (this.getWatchedCount(movies) / movies.length) * 100;
  }

  /**
   * 计算平均评分
   * @param movies 电影数组
   * @returns 平均评分
   */
  getAverageRating(movies: Movie[]): number {
    if (movies.length === 0) return 0;
    const totalRating = movies.reduce((sum, movie) => sum + movie.rating, 0);
    return totalRating / movies.length;
  }
}
