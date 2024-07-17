import { Component, EventEmitter, Output, HostListener } from '@angular/core';
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
  activeUserID = 0;

  constructor(private commentService: CommentService) {
    this.users = this.commentService.getUsers();
  }

  onInput(event: any) {
    const value = event.target.value;
    const lastChar = value.slice(-1);
    if (lastChar === '@' && !this.showUserDropdown) {
      this.showUserDropdown = true;
      this.filteredUsers = this.users;
    }

    // Detect and filter users if typing after '@'
    const atIndex = value.lastIndexOf('@');
    if (atIndex !== -1) {
      const searchTerm = value.slice(atIndex + 1).toLowerCase();
      this.filteredUsers = this.users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm)
      );

      // Close dropdown if a space is typed after '@'
      if (value.slice(atIndex + 1).includes(' ')) {
        this.showUserDropdown = false;
      } else {
        this.showUserDropdown = true;
      }
    } else {
      this.showUserDropdown = false;
    }
  }

  selectUser(user: any) {
    const atIndex = this.newCommentText.lastIndexOf('@');
    this.newCommentText = `${this.newCommentText.slice(0, atIndex + 1)}${
      user.name
    } `;
    // Move cursor back to input field after selecting a user to tag.
    this.showUserDropdown = false;
    const el = document.getElementById('commentInput');
    if (el) {
      el.focus();
    }
  }

  addComment() {
    if (this.newCommentText.trim()) {
      this.commentService.addComment(this.newCommentText);
      this.newCommentText = '';
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.showUserDropdown) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.moveSelection('down');
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.moveSelection('up');
      } else if (event.key === 'Enter' || event.key === 'Tab') {
        event.preventDefault();
        if (this.activeUserID !== null) {
          const selectedUser = this.filteredUsers.find(
            (user) => user.userID === this.activeUserID
          );
          if (selectedUser) {
            this.selectUser(selectedUser);
          }
        }
      }
    }
  }

  private moveSelection(direction: 'up' | 'down') {
    if (this.filteredUsers.length === 0) {
      return;
    }

    const currentIndex = this.filteredUsers.findIndex(
      (user) => user.userID === this.activeUserID
    );
    console.log('current index', currentIndex);

    let nextIndex: number;
    if (direction === 'down') {
      nextIndex = (currentIndex + 1) % this.filteredUsers.length;
    } else {
      // 'up'
      nextIndex =
        (currentIndex - 1 + this.filteredUsers.length) %
        this.filteredUsers.length;
    }
    console.log('next index', nextIndex);
    this.activeUserID = this.filteredUsers[nextIndex].userID;
  }
}
