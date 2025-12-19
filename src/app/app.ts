import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `<router-outlet>`,
  imports: [RouterOutlet],
  // styleUrl: './app.scss'
})
export class App {

}
