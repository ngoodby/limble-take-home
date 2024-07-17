import { Component } from '@angular/core';
import { CommentService } from '../comment.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css'],
  imports: [FormsModule],
  standalone: true
})
export default class CommentFormComponent {
  newCommentText = '';

  constructor(private commentService: CommentService) { }

  addComment() {
    if (this.newCommentText.trim()) {
      this.commentService.addComment(this.newCommentText);
      this.newCommentText = '';
    }
  }
}
