import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Movie } from '../../models/movie';
import { MovieService } from '../../services/movie.service';

/**
 * MovieForm 组件 - 添加新电影表单
 *
 * 功能：提供表单界面让用户添加新电影到影库
 * 特性：使用 ngModel 实现双向数据绑定，提交后自动重置表单
 */
@Component({
  selector: 'app-movie-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSliderModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './movie-form.component.html',
  styleUrl: './movie-form.component.scss'
})
export class MovieFormComponent {
  /**
   * 表单数据模型 - 不包含 id 的电影对象
   * 使用 Omit<Movie, 'id'> 类型，id 将由服务自动生成
   */
  newMovie: Omit<Movie, 'id'> = {
    title: '',
    director: '',
    releaseDate: new Date(),
    rating: 8.0,
    isWatched: false,
    posterUrl: '',
    description: '',
    actors: '',
    duration: 120,
    tags: []
  };

  /**
   * 提交成功提示状态
   */
  showSuccessMessage = false;

  /**
   * 构造函数注入 MovieService
   */
  constructor(private movieService: MovieService) { }

  /**
   * 提交表单方法
   * 调用 MovieService.addMovie() 添加新电影
   * 提交成功后重置表单并显示提示
   */
  onSubmit(): void {
    // 调用服务添加新电影
    this.movieService.addMovie(this.newMovie);

    // 显示成功提示
    this.showSuccessMessage = true;

    // 2秒后隐藏提示
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 2000);

    // 重置表单
    this.resetForm();
  }

  /**
   * 重置表单数据
   * 将所有字段恢复为初始值
   */
  private resetForm(): void {
    this.newMovie = {
      title: '',
      director: '',
      releaseDate: new Date(),
      rating: 8.0,
      isWatched: false,
      posterUrl: '',
      description: '',
      actors: '',
      duration: 120,
      tags: []
    };
  }
}
