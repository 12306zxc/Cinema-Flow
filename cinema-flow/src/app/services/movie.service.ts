import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { delay, map, tap, catchError } from 'rxjs/operators';
import { Movie } from '../models/movie';
import { MessageService } from './message.service';

/**
 * MovieService - 电影数据服务
 *
 * 功能：管理电影数据的增删改查操作
 * 特性：
 * 1. 所有操作通过MessageService记录日志，确保数据流可追溯
 * 2. 使用localStorage实现数据持久化，确保刷新页面后数据不丢失
 * 3. 支持RxJS Observable模式，提供响应式数据访问
 * 4. 使用BehaviorSubject实现数据实时更新
 */
@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private readonly messageService = inject(MessageService);
  // 私有数据存储 - 组件禁止直接访问
  private movies: Movie[] = [];
  // 本地存储键名
  private readonly STORAGE_KEY = 'cinema-flow-movies';
  // BehaviorSubject用于实现数据实时更新
  private moviesSubject = new BehaviorSubject<Movie[]>([]);
  
  /**
   * 构造函数初始化数据
   */
  constructor() {
    this.initializeData();
  }

  /**
   * 初始化数据
   * 直接初始化默认mock数据，确保有6部电影
   */
  private initializeData(): void {
    // 初始化默认mock数据
    this.initializeMockData();
    this.messageService.add('MovieService: 初始化默认电影数据');
    // 通知所有订阅者数据已更新
    this.moviesSubject.next(this.movies);
  }

  /**
   * 初始化默认mock数据
   */
  private initializeMockData(): void {
    this.movies = [
      { id: 1, title: '星际穿越', director: '诺兰', directorId: 1, genre: '科幻', rating: 9.3, releaseYear: 2014, status: 'showing', releaseDate: new Date(2014, 10, 7), isWatched: true, posterUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=interstellar%20movie%20poster%20space%20travel&image_size=square' },
      { id: 2, title: '盗梦空间', director: '诺兰', directorId: 1, genre: '科幻', rating: 9.4, releaseYear: 2010, status: 'archived', releaseDate: new Date(2010, 7, 13), isWatched: true, posterUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=inception%20movie%20poster%20dream%20heist&image_size=square' },
      { id: 3, title: '蝙蝠侠：黑暗骑士', director: '诺兰', directorId: 1, genre: '动作', rating: 9.1, releaseYear: 2008, status: 'showing', releaseDate: new Date(2008, 6, 18), isWatched: true, posterUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=the%20dark%20knight%20movie%20poster%20batman&image_size=square' },
      { id: 4, title: '卧虎藏龙', director: '李安', directorId: 2, genre: '武侠', rating: 8.9, releaseYear: 2000, status: 'archived', releaseDate: new Date(2000, 12, 8), isWatched: true, posterUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=crouching%20tiger%20hidden%20dragon%20movie%20poster%20martial%20arts&image_size=square' },
      { id: 5, title: '千与千寻', director: '宫崎骏', directorId: 3, genre: '动画', rating: 9.4, releaseYear: 2001, status: 'showing', releaseDate: new Date(2001, 7, 20), isWatched: true, posterUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=spirited%20away%20movie%20poster%20anime&image_size=square' },
      { id: 6, title: '花样年华', director: '王家卫', directorId: 4, genre: '剧情', rating: 8.6, releaseYear: 2000, status: 'archived', releaseDate: new Date(2000, 9, 29), isWatched: true, posterUrl: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=in%20the%20mood%20for%20love%20movie%20poster%20romance&image_size=square' }
    ];
    // 同步到本地存储
    this.syncToLocalStorage();
    // 通知所有订阅者数据已更新
    this.moviesSubject.next(this.movies);
  }

  /**
   * 同步数据到本地存储
   */
  private syncToLocalStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.movies));
      this.messageService.add('MovieService: 电影数据已同步到本地存储');
    } catch (error) {
      this.messageService.add('MovieService: 本地存储同步失败');
    }
  }

  /**
   * 获取所有电影
   * @returns Observable<Movie[]> 电影数组的 Observable
   */
  getMovies(): Observable<Movie[]> {
    return of([...this.movies]).pipe(
      delay(200),
      tap(list => this.messageService.add(`MovieService: 已加载 ${list.length} 部电影`)),
      catchError(error => {
        this.messageService.add(`MovieService: 加载电影列表失败: ${error.message || error}`);
        return of([]); // 降级为空列表
      })
    );
  }

  /**
   * 根据 ID 获取电影
   * @param id 电影ID
   * @returns Observable<Movie | undefined> 匹配的电影或 undefined 的 Observable
   */
  getMovieById(id: number): Observable<Movie | undefined> {
    return of(this.movies.find(movie => movie.id === id)).pipe(
      delay(150),
      tap(movie => this.messageService.add(
        movie ? `MovieService: 查询到电影 ${movie.title}` : `MovieService: id=${id} 未找到`
      )),
      catchError(error => {
        this.messageService.add(`MovieService: 查询电影失败: ${error.message || error}`);
        return of(undefined); // 降级为undefined
      })
    );
  }

  /**
   * 添加新电影
   * 自动生成自增ID，将新电影添加到数组中
   * @param movie 不包含id的电影对象
   * @returns Observable<Movie> 新增的电影对象的 Observable
   */
  addMovie(movie: Omit<Movie, 'id'>): Observable<Movie> {
    try {
      // 计算新的自增ID：取当前最大ID+1，如果没有电影则从1开始
      const newId = Math.max(...this.movies.map(m => m.id), 0) + 1;
      // 创建新电影对象
      const createdMovie = { ...movie, id: newId };
      // 将新电影添加到数组
      this.movies.push(createdMovie);
      // 同步到本地存储
      this.syncToLocalStorage();
      // 通知所有订阅者数据已更新
      this.moviesSubject.next(this.movies);
      // 记录日志
      this.messageService.add(`MovieService: 新增电影：${movie.title}（ID:${newId}）`);
      return of(createdMovie).pipe(
        delay(150),
        catchError(error => {
          const errorMessage = error instanceof Error ? error.message : String(error);
          this.messageService.add(`MovieService: 添加电影失败: ${errorMessage}`);
          throw error; // 重新抛出错误
        })
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.messageService.add(`MovieService: 添加电影失败: ${errorMessage}`);
      return throwError(() => error);
    }
  }

  /**
   * 删除电影
   * 根据ID删除对应的电影
   * @param id 要删除的电影ID
   * @returns Observable<boolean> 删除成功返回true，失败返回false的 Observable
   */
  deleteMovie(id: number): Observable<boolean> {
    try {
      // 查找电影在数组中的索引
      const index = this.movies.findIndex(m => m.id === id);
      let success = false;
      if (index > -1) {
        // 找到后使用splice删除
        this.movies.splice(index, 1);
        // 同步到本地存储
        this.syncToLocalStorage();
        // 通知所有订阅者数据已更新
        this.moviesSubject.next(this.movies);
        // 记录成功日志
        this.messageService.add(`MovieService: 删除ID为${id}的电影，操作成功`);
        success = true;
      } else {
        // 记录失败日志
        this.messageService.add(`MovieService: 删除ID为${id}的电影，操作失败`);
      }
      return of(success).pipe(
        delay(150),
        catchError(error => {
          const errorMessage = error instanceof Error ? error.message : String(error);
          this.messageService.add(`MovieService: 删除电影失败: ${errorMessage}`);
          return of(false); // 降级为false
        })
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.messageService.add(`MovieService: 删除电影失败: ${errorMessage}`);
      return of(false);
    }
  }

  /**
   * 更新电影
   * 根据ID更新对应的电影信息
   * @param updatedMovie 更新后的完整电影对象
   * @returns Observable<boolean> 更新成功返回true，失败返回false的 Observable
   */
  updateMovie(updatedMovie: Movie): Observable<boolean> {
    try {
      // 查找电影在数组中的索引
      const index = this.movies.findIndex(m => m.id === updatedMovie.id);
      let success = false;
      if (index > -1) {
        // 找到后直接替换该位置的元素
        this.movies[index] = updatedMovie;
        // 同步到本地存储
        this.syncToLocalStorage();
        // 通知所有订阅者数据已更新
        this.moviesSubject.next(this.movies);
        // 记录成功日志
        this.messageService.add(`MovieService: 更新ID为${updatedMovie.id}的电影：${updatedMovie.title}，操作成功`);
        success = true;
      } else {
        // 记录失败日志
        this.messageService.add(`MovieService: 更新ID为${updatedMovie.id}的电影：${updatedMovie.title}，操作失败`);
      }
      return of(success).pipe(
        delay(150),
        catchError(error => {
          const errorMessage = error instanceof Error ? error.message : String(error);
          this.messageService.add(`MovieService: 更新电影失败: ${errorMessage}`);
          return of(false); // 降级为false
        })
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.messageService.add(`MovieService: 更新电影失败: ${errorMessage}`);
      return of(false);
    }
  }
}