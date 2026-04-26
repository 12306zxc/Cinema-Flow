import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, combineLatest, map, switchMap } from 'rxjs';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie';
import { RatingLevelPipe } from '../../pipes/rating-level.pipe';
@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, RatingLevelPipe /* Material */],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss'
})
export class MovieListComponent implements OnInit {
  searchTerm = '';
  currentGenre = '';
  filtered$!: Observable<Movie[]>;

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.filtered$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.currentGenre = params.get('genre') || '';
        if (this.currentGenre) {
          return this.movieService.getMoviesByGenre(this.currentGenre);
        } else {
          return this.movieService.getMovies();
        }
      })
    );
  }
  genres$ = this.movieService.getMovies().pipe(
    map(movies => [...new Set(movies.map(m => m.genre))])
  );

  /**
   * 搜索电影
   */
  onSearchChange(searchTerm: string): void {
    this.router.navigate(['/movies'], {
      queryParams: { search: searchTerm }
    });
  }

  /**
   * 删除电影
   */
  deleteMovie(id: number): void {
    if (confirm('确定要删除这部电影吗？')) {
      this.movieService.deleteMovie(id).subscribe();
    }
  }
}