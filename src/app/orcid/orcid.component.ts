import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orcid-redirect',
  templateUrl: './orcid.component.html',
  styleUrls: ['./orcid.component.scss'],
})
export class OrcidComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this.router.navigateByUrl('/accounts');
    }, 5000);
  }
}
