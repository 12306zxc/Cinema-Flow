import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie';
import { RatingLevelPipe } from '../../pipes/rating-level.pipe';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    RatingLevelPipe
  ],
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.scss'
})
export class MovieDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private movieService = inject(MovieService);
  private location = inject(Location);
  
  movie?: Movie;
  prevMovieId?: number;
  nextMovieId?: number;
  
  ngOnInit(): void {
    // 从路由参数中获取电影ID
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.loadMovie(id);
    });
  }
  
  private loadMovie(id: number): void {
    this.movieService.getMovieById(id).subscribe(movie => {
      this.movie = movie;
      if (this.movie) {
        // 计算上一部和下一部的ID
        this.movieService.getMovies().subscribe(movies => {
          const currentIndex = movies.findIndex(m => m.id === id);
          this.prevMovieId = currentIndex > 0 ? movies[currentIndex - 1].id : undefined;
          this.nextMovieId = currentIndex < movies.length - 1 ? movies[currentIndex + 1].id : undefined;
        });
      }
    });
  }
  
  goBack(): void {
    this.location.back(); // 浏览器后退
  }
  
  deleteMovie(): void {
    if (this.movie && confirm('确定要删除这部电影吗？')) {
      this.movieService.deleteMovie(this.movie.id);
      this.router.navigate(['/movies']); // 删除后跳转到列表页
    }
  }
  
  onWatchedChange(event: any): void {
    if (this.movie) {
      const updatedMovie = { ...this.movie, isWatched: event.checked };
      this.movieService.updateMovie(updatedMovie);
      this.movie = updatedMovie;
    }
  }
}
