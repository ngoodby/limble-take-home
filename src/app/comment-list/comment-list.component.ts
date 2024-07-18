import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';

import { CommentService } from '../comment-service/comment.service';
import { HighlightMentionsPipe } from '../highlight-mentions.pipe';

@Component({
  selector: 'comment-list',
  templateUrl: './comment-list.component.html',
  standalone: true,
  imports: [FontAwesomeModule, HighlightMentionsPipe],
})
export default class AppComponent {
  commentService = inject(CommentService);
  faComment = faComment;
}
