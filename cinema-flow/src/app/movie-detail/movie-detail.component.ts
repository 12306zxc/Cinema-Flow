import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Movie } from '../models/movie';
import { MovieService } from '../services/movie.service';

/**
 * MovieDetail 组件 - 电影详情展示与编辑
 *
 * 功能：展示选中电影的详细信息，支持编辑模式修改电影信息
 * 特性：通过 isEditing 状态切换查看/编辑模式，编辑后保存更新到服务
 */
@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSliderModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.scss'
})
export class MovieDetailComponent {
  /**
   * 输入属性：当前选中的电影
   */
  @Input() movie?: Movie;

  /**
   * 编辑模式状态
   * true 表示处于编辑模式，false 表示查看模式
   */
  isEditing = false;

  /**
   * 构造函数注入 MovieService
   */
  constructor(private movieService: MovieService) { }

  /**
   * 进入编辑模式
   * 切换 isEditing 状态为 true
   */
  onEdit(): void {
    if (this.movie) {
      this.isEditing = true;
    }
  }

  /**
   * 保存修改
   * 调用服务更新电影信息，成功后退出编辑模式
   */
  onSave(): void {
    if (this.movie) {
      // 调用服务更新电影
      this.movieService.updateMovie(this.movie);
      // 退出编辑模式
      this.isEditing = false;
    }
  }

  /**
   * 取消编辑
   * 放弃修改，退出编辑模式，数据保持不变
   */
  onCancel(): void {
    // 退出编辑模式，不保存数据
    this.isEditing = false;
  }
}
