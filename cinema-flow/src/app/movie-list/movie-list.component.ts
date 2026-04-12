import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie';
import { MovieDetailComponent } from '../movie-detail/movie-detail.component';
import { MovieStatsComponent } from '../movie-stats/movie-stats.component';
import { MovieFormComponent } from '../components/movie-form/movie-form.component';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MovieDetailComponent,
    MovieStatsComponent,
    MovieFormComponent
  ],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss'
})
export class MovieListComponent implements OnInit {
  /**
   * 电影数据的 Observable 流
   */
  movies$: Observable<Movie[]>;
  selectedMovie?: Movie;

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
   * 选中电影
   * @param movie 选中的电影对象
   */
  onSelect(movie: Movie): void {
    this.selectedMovie = movie;
  }

  /**
   * 删除电影
   * 调用服务删除指定ID的电影，成功后刷新列表
   * @param id 要删除的电影ID
   */
  onDeleteMovie(id: number): void {
    const success = this.movieService.deleteMovie(id);
    if (success) {
      // 重新从服务获取数据，刷新列表
      this.movies$ = this.movieService.getMovies();
      // 若删除的是当前选中的电影，清空选中状态
      if (this.selectedMovie?.id === id) {
        this.selectedMovie = undefined;
      }
    }
  }
}
