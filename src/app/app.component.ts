import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatIconModule, MatProgressBarModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Angular';
  fileName = '';

  constructor(private http: HttpClient) {}

  uploadError: string | null = null;
  isUploading: boolean = false;
  uploadProgress: number = 0;
  uploadSubscription: any;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.uploadError = 'No file selected';
      return;
    }

    const file = input.files[0];
    this.fileName = file.name;
    this.uploadError = null;
    this.isUploading = true;

    const formData = new FormData();
    formData.append('file', file);

    this.uploadSubscription = this.http.post('http://localhost:3000/api/upload', formData, {

      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event: any) => {
        if (event.type === 1) { // HttpEventType.UploadProgress
          this.uploadProgress = Math.round(100 * event.loaded / event.total);
        } else if (event.type === 4) { // HttpEventType.Response
          console.log('File uploaded successfully');
          this.isUploading = false;
          this.uploadProgress = 0;
        }
      },
      error: (err) => {
        console.error('Upload failed:', err);
        this.uploadError = 'Upload failed. Please try again.';
        if (err.status === 404) {
          this.uploadError = 'Server endpoint not found. Please check the API URL.';
        }
        this.isUploading = false;
        this.uploadProgress = 0;
      }
    });
  }

  cancelUpload() {
    if (this.uploadSubscription) {
      this.uploadSubscription.unsubscribe();
      this.isUploading = false;
      this.uploadProgress = 0;
      this.uploadError = 'Upload cancelled';
    }
  }
}
