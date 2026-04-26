import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DirectorService } from '../../services/director.service';
@Component({
  selector: 'app-director-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './director-list.component.html',
  styleUrl: './director-list.component.scss'
})
export class DirectorListComponent {
  readonly directors$ = this.directorService.getDirectors();

  constructor(private directorService: DirectorService) {}
}
