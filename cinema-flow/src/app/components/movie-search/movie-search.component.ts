// components/movie-search/movie-search.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-movie-search',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="search-component">
      <h4>电影搜索</h4>
      <input 
        #searchBox
        (input)="search(searchBox.value)"
        placeholder="输入电影名称..."
        class="search-input">
      
      <ul class="search-results" *ngIf="movies$ | async as movies">
        <li *ngFor="let movie of movies">
          <a [routerLink]="['/movies', movie.id]">
            {{ movie.title }}
            <span class="genre-tag">{{ movie.genre }}</span>
            <span class="rating">{{ movie.rating }}</span>
          </a>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .search-input {
      width: 100%; 
      padding: 8px 12px; 
      border: 1px solid #ccc; 
      border-radius: 4px; 
      font-size: 14px;
    }
    .search-results { 
      list-style: none; 
      padding: 0; 
      margin: 4px 0 0; 
    }
    .search-results li {
      border-bottom: 1px solid #eee; 
      padding: 8px 4px;
    }
    .search-results li a {
      text-decoration: none; 
      color: #333; 
      display: flex; 
      align-items: center; 
      gap: 8px;
    }
    .search-results li a:hover { 
      color: #1976d2; 
    }
    .genre-tag {
      font-size: 12px; 
      background: #e0e0e0; 
      padding: 2px 6px; 
      border-radius: 4px;
    }
    .rating {
      font-size: 12px; 
      color: #ff9800; 
      margin-left: auto; 
    }
  `]
})
export class MovieSearchComponent implements OnInit {
  movies$!: Observable<Movie[]>;
  private searchTerms = new Subject<string>();
  
  constructor(private movieService: MovieService) {}

  /** 每次输入变化时推送搜索词到 Subject 流 */
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.movies$ = this.searchTerms.pipe(
      debounceTime(300),        // 防抖：等待 300ms 无输入
      distinctUntilChanged(),   // 去重：忽略与上次相同的值
      switchMap(term =>         // 取消前一个未完成请求，只保留最新
        this.movieService.searchMovies(term)
      )
    );
  }
}