import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-movie-add',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './movie-add.component.html',
  styleUrl: './movie-add.component.scss'
})
export class MovieAddComponent {
  private movieService = inject(MovieService);
  private router = inject(Router);

  // 表单数据
  movieForm = {
    title: '',
    director: '',
    rating: 0,
    releaseDate: new Date(),
    isWatched: false,
    posterUrl: '',
    description: '',
    actors: '',
    duration: 0,
    tags: ''
  };

  // 加载状态
  isLoading = false;
  // 错误信息
  errorMessage: string | null = null;

  // 提交表单
  onSubmit(): void {
    if (!this.movieForm.title || !this.movieForm.director) {
      this.errorMessage = '请填写电影名称和导演';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    // 准备电影数据
    const newMovie: Omit<Movie, 'id'> = {
      title: this.movieForm.title,
      director: this.movieForm.director,
      rating: this.movieForm.rating,
      releaseDate: this.movieForm.releaseDate,
      isWatched: this.movieForm.isWatched,
      posterUrl: this.movieForm.posterUrl,
      description: this.movieForm.description,
      actors: this.movieForm.actors,
      duration: this.movieForm.duration,
      tags: this.movieForm.tags ? this.movieForm.tags.split(',').map(tag => tag.trim()) : []
    };

    // 调用服务添加电影
    this.movieService.addMovie(newMovie).subscribe({
      next: () => {
        // 添加成功，跳转到电影列表
        this.router.navigate(['/movies']);
      },
      error: (error) => {
        this.errorMessage = `添加电影失败: ${error.message || '未知错误'}`;
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // 重置表单
  resetForm(): void {
    this.movieForm = {
      title: '',
      director: '',
      rating: 0,
      releaseDate: new Date(),
      isWatched: false,
      posterUrl: '',
      description: '',
      actors: '',
      duration: 0,
      tags: ''
    };
    this.errorMessage = null;
  }
}