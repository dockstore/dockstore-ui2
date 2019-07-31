import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HomePageService {
  constructor(private router: Router) {}
  goToSearch(searchValue: string) {
    this.router.navigate(['/search'], { queryParams: { search: searchValue } });
  }
}
