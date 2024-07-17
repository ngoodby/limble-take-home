import { Component, EventEmitter, Output } from '@angular/core';
import { CommentService, User } from '../comment.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css'],
  imports: [FormsModule],
  standalone: true,
})
export default class CommentFormComponent {
  @Output() commentAdded = new EventEmitter<string>();
  newCommentText = '';
  showUserDropdown = false;
  filteredUsers: User[] = [];
  users: User[] = [];

  constructor(private commentService: CommentService) {
    this.users = this.commentService.getUsers();
  }

  onInput(event: any) {
    const value = event.target.value;
    const lastChar = value.slice(-1);
    console.log(lastChar);

    if (lastChar === '@') {
      this.showUserDropdown = true;
      this.filteredUsers = this.users;
    } else {
      this.showUserDropdown = false;
    }

    // Detect and filter users if typing after '@'
    const atIndex = value.lastIndexOf('@');
    if (atIndex !== -1) {
      const searchTerm = value.slice(atIndex + 1).toLowerCase();
      this.filteredUsers = this.users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm)
      );
    }
  }

  selectUser(user: any) {
    const atIndex = this.newCommentText.lastIndexOf('@');
    this.newCommentText = `${this.newCommentText.slice(0, atIndex + 1)}${
      user.name
    } `;
    this.showUserDropdown = false;
  }

  addComment() {
    if (this.newCommentText.trim()) {
      this.commentService.addComment(this.newCommentText);
      this.newCommentText = '';
    }
  }
}
