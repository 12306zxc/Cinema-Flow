// services/director.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Director } from '../models/director';
import { MessageService } from './message.service';
import { Movie } from '../models/movie';

@Injectable({ providedIn: 'root' })
export class DirectorService {
  private apiUrl = 'http://localhost:5000/api/directors';
  
  constructor(
    private http: HttpClient,
    private readonly messageService: MessageService
  ) {}

  /**
   * 获取所有导演列表
   * @returns Observable<Director[]>
   */
  getDirectors(): Observable<Director[]> {
    return this.http.get<Director[]>(this.apiUrl).pipe(
      tap(list => this.messageService.add(`DirectorService: 已加载 ${list.length} 位导演`)),
      catchError(this.handleError)
    );
  }

  /**
   * 根据ID查询单个导演
   * @param id 导演ID
   * @returns Observable<Director>
   */
  getDirectorById(id: number): Observable<Director> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Director>(url).pipe(
      tap(director => this.messageService.add(`DirectorService: 查询到导演 ${director.name}`)),
      catchError(this.handleError)
    );
  }

  /**
   * 获取导演的所有电影
   * @param id 导演ID
   * @returns Observable<Movie[]>
   */
  getDirectorMovies(id: number): Observable<Movie[]> {
    const url = `${this.apiUrl}/${id}/movies`;
    return this.http.get<Movie[]>(url).pipe(
      tap(movies => this.messageService.add(`DirectorService: 加载导演电影 ${movies.length} 部`)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '未知错误';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `客户端错误: ${error.error.message}`;
    } else {
      errorMessage = `服务器错误: ${error.status} ${error.message}`;
    }
    this.messageService.add(`DirectorService: ${errorMessage}`);
    return throwError(() => new Error(errorMessage));
  }
}