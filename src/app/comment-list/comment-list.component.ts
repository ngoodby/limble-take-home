import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';

import { CommentService } from '../comment-service/comment.service';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  standalone: true,
  imports: [FontAwesomeModule],
})
export default class AppComponent {
  commentService = inject(CommentService);
  faComment = faComment;
}
