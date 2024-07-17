import { Component, inject } from '@angular/core';
import { CommentService } from '../comment.service';

@Component({
  selector: 'comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css'],
  standalone: true,
})
export default class AppComponent {
  commentService = inject(CommentService);
}
