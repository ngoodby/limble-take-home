import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import CommentFormComponent from './comment-form/comment-form.component';
import CommentListComponent from './comment-list/comment-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommentFormComponent, CommentListComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
