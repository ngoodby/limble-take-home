import { Component } from '@angular/core';
import CommentFormComponent from './comment-form/comment-form.component';
import CommentListComponent from './comment-list/comment-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommentFormComponent, CommentListComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
