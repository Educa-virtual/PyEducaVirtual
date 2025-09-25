import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  standalone: true,
  imports: [RouterLink],
})
export class NotfoundComponent {
  constructor(router: Router) {
    router.navigate(['/']);
  }
}
