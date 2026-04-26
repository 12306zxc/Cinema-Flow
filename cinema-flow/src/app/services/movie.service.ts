import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Movie } from '../models/movie';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'http://localhost:5000/api/movies';
  
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl).pipe(
      tap(movies => this.messageService.add(`MovieService: 已加载 ${movies.length} 部电影`)),
      catchError(this.handleError)
    );
  }

  getMovieById(id: number): Observable<Movie> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Movie>(url).pipe(
      tap(movie => this.messageService.add(`MovieService: 查询到电影 ${movie.title}`)),
      catchError(this.handleError)
    );
  }

  addMovie(movie: Omit<Movie, 'id'>): Observable<Movie> {
    return this.http.post<Movie>(this.apiUrl, movie, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(
      tap(newMovie => this.messageService.add(`MovieService: 新增电影 ${newMovie.title}`)),
      catchError(this.handleError)
    );
  }

  deleteMovie(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url).pipe(
      tap(() => this.messageService.add(`MovieService: 删除电影 id=${id}`)),
      catchError(this.handleError)
    );
  }

  updateMovie(updatedMovie: Movie): Observable<Movie> {
    const url = `${this.apiUrl}/${updatedMovie.id}`;
    return this.http.put<Movie>(url, updatedMovie, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(
      tap(movie => this.messageService.add(`MovieService: 更新电影 ${movie.title}`)),
      catchError(this.handleError)
    );
  }

  searchMovies(term: string): Observable<Movie[]> {
    const url = `${this.apiUrl}?title=${term}`;
    return this.http.get<Movie[]>(url).pipe(
      tap(movies => this.messageService.add(`MovieService: 搜索到 ${movies.length} 部电影`)),
      catchError(this.handleError)
    );
  }

  getMoviesByGenre(genre: string): Observable<Movie[]> {
    const url = `${this.apiUrl}?genre=${genre}`;
    return this.http.get<Movie[]>(url).pipe(
      tap(movies => this.messageService.add(`MovieService: 加载 ${genre} 类型电影 ${movies.length} 部`)),
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
    this.messageService.add(`MovieService: ${errorMessage}`);
    return throwError(() => new Error(errorMessage));
  }
}