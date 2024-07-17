import { Component, inject } from '@angular/core';
import { CommentService } from '../comment.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css'],
  standalone: true,
  imports: [FontAwesomeModule],
})
export default class AppComponent {
  commentService = inject(CommentService);
  faComment=faComment
}
