import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, combineLatest, map } from 'rxjs';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie';
@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule /* Material */],
  templateUrl: './movie-list.component.html',
  styleUrl: './movie-list.component.scss'
})
export class MovieListComponent implements OnInit {
  private movieService = inject(MovieService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  searchTerm = '';
  filtered$!: Observable<Movie[]>;

  ngOnInit(): void {
    this.filtered$ = combineLatest([
      this.movieService.getMovies(),
      this.route.queryParamMap
    ]).pipe(
      map(([movies, params]) => {
        const term = (params.get('search') || '').toLowerCase();
        this.searchTerm = term;
        if (!term) return movies;
        return movies.filter(m =>
          m.title.toLowerCase().includes(term) ||
          m.director.toLowerCase().includes(term)
        );
      })
    );
  }
  onSearchChange(value: string): void {
    this.router.navigate(['/movies'], {
      queryParams: value ? { search: value } : {}
    });
  }
  deleteMovie(id: number): void {
    if (!confirm('确定要删除这部电影吗？')) return;
    this.movieService.deleteMovie(id).subscribe();
  }
}

