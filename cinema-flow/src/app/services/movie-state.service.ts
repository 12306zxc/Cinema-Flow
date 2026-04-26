// services/movie-state.service.ts（改造要点）
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MovieService } from './movie.service';
import { MessageService } from './message.service';
import { Movie } from '../models/movie';

@Injectable({ providedIn: 'root' })
export class MovieStateService {
  private readonly moviesSubject = new BehaviorSubject<Movie[]>([]);
  readonly movies$ = this.moviesSubject.asObservable();
  
  constructor(
    private readonly movieService: MovieService,
    private readonly messageService: MessageService
  ) {}

  /** 从后端加载数据到状态中心 */
  load(): void {
    this.movieService.getMovies().subscribe(list => {
      this.moviesSubject.next(list);
    });
  }

  /** 乐观删除：先更新 UI，再发 HTTP 请求 */
  deleteOptimistic(id: number): void {
    // ① 立即从本地状态移除（UI 瞬间响应）
    const snapshot = this.moviesSubject.value;
    const removed = snapshot.find(m => m.id === id);
    this.moviesSubject.next(snapshot.filter(m => m.id !== id));

    // ② 发送 DELETE 请求到后端
    this.movieService.deleteMovie(id).subscribe({
      next: () => this.messageService.add(`乐观删除成功: id=${id}`),
      error: () => {
        // ③ 如果请求失败，回滚状态
        this.messageService.add(`删除失败，已回滚: id=${id}`);
        if (removed) {
          this.moviesSubject.next([...this.moviesSubject.value, removed]);
        }
      }
    });
  }

  /** 乐观添加：先更新 UI，服务器确认后替换为含真实 id 的对象 */
  addOptimistic(movie: Omit<Movie, 'id'>): void {
    const tempId = -Date.now(); // 临时负数 id
    const tempMovie: Movie = { ...movie, id: tempId } as Movie;
    // 立即更新本地 UI
    this.moviesSubject.next([...this.moviesSubject.value, tempMovie]);

    // 发送 POST 请求到后端
    this.movieService.addMovie(movie).subscribe({
      next: (created) => {
        // 替换临时对象为服务器返回的真实对象
        const current = this.moviesSubject.value;
        this.moviesSubject.next(
          current.map(m => m.id === tempId ? created : m)
        );
      },
      error: () => {
        // 请求失败，回滚状态（移除临时对象）
        this.moviesSubject.next(
          this.moviesSubject.value.filter(m => m.id !== tempId)
        );
      }
    });
  }
}