import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
uploadFile() {
throw new Error('Method not implemented.');
}
onFileSelected($event: Event) {
throw new Error('Method not implemented.');
}
  title = 'yo mama';
  carica: any;
  fileName: any;
}
