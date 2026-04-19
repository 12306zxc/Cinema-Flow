import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component')
      .then(m => m.DashboardComponent),
    title: 'CinemaFlow - 仪表盘'
  },
  {
    path: 'add',
    loadComponent: () => import('./pages/movie-add/movie-add.component')
      .then(m => m.MovieAddComponent),
    title: 'CinemaFlow - 添加电影'
  },
  {
    path: 'movies',
    loadComponent: () => import('./pages/movie-list/movie-list.component')
      .then(m => m.MovieListComponent),
    title: 'CinemaFlow - 电影列表'
  },
  {
    path: 'movies/:id',
    loadComponent: () => import('./pages/movie-detail/movie-detail.component')
      .then(m => m.MovieDetailComponent),
    title: 'CinemaFlow - 电影详情'
  },
  {
    path: 'movies/genre/:genre',
    loadComponent: () => import('./pages/movie-list/movie-list.component')
      .then(m => m.MovieListComponent),
    title: 'CinemaFlow - 分类浏览'
  },
  {
    path: 'directors',
    loadComponent: () => import('./pages/director-list/director-list.component')
      .then(m => m.DirectorListComponent),
    title: 'CinemaFlow - 导演库'
  },
  {
    path: 'directors/:id',
    loadComponent: () => import('./pages/director-detail/director-detail.component')
      .then(m => m.DirectorDetailComponent),
    title: 'CinemaFlow - 导演详情'
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component')
      .then(m => m.AboutComponent),
    title: 'CinemaFlow - 关于'
  },
  { path: '**', redirectTo: '/dashboard' }
]