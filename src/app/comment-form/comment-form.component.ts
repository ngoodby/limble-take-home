import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CommentService } from '../comment-service/comment.service';
import { User } from '../comment-service/comment.types';

@Component({
  selector: 'app-comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css'],
  imports: [FormsModule],
  standalone: true,
})
export default class CommentFormComponent {
  @Output() commentAdded = new EventEmitter<string>();
  newCommentText = '';
  filteredUsers: User[] = [];
  users: User[] = [];
  activeUserID: number | null = null;

  constructor(private commentService: CommentService) {
    this.users = this.commentService.getUsers();
  }

  /**
   * Tracks user's input characters to manage whether or not to show the dropdown
   * menu of potential mentions and filters the list of potential mentions as the
   * user types beyond the '@'.
   *
   * @public
   * @param {*} event
   */
  public onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this._manageUserDropdown(value);
    this._detectAndFilterUsers(value);
  }

  private _manageUserDropdown(value: string) {
    const lastChar = value.slice(-1);
    if (lastChar === '@') {
      this._openUserDropdown();
    }
  }

  private _openUserDropdown() {
    const d = document.getElementById('commentDialog') as HTMLDialogElement;
    d.show();
    this.filteredUsers = this.users;
  }

  private _detectAndFilterUsers(value: string) {
    const atIndex = value.lastIndexOf('@');
    if (atIndex !== -1) {
      const searchTerm = value.slice(atIndex + 1).toLowerCase();
      this.filteredUsers = this.users.filter(user =>
        user.name.toLowerCase().includes(searchTerm)
      );
      this._closeDropdownIfSpaceTyped(value, atIndex);
    } else {
      const d = document.getElementById('commentDialog') as HTMLDialogElement;
      d.close();
    }
  }

  private _closeDropdownIfSpaceTyped(value: string, atIndex: number) {
    const d = document.getElementById('commentDialog') as HTMLDialogElement;
    if (value.slice(atIndex + 1).includes(' ')) {
      d.close();
    } else {
      d.show();
    }
  }

  /**
   * Identify the target mention, close mention dropdown, and move focus back to the input.
   *
   * @public
   * @param {User} user
   */
  public selectUser(user: User) {
    const d = document.getElementById('commentDialog') as HTMLDialogElement;
    this._addMentionToComment(user);
    d.close();
    this._moveFocusToInput();
  }

  private _addMentionToComment(user: User) {
    const atIndex = this.newCommentText.lastIndexOf('@');
    this.newCommentText = `${this.newCommentText.slice(0, atIndex + 1)}${user.name} `;
  }

  private _moveFocusToInput() {
    const el = document.getElementById('commentInput');
    if (el) {
      el.focus();
    }
  }

  /** Use the CommentService method pushComment to push a comment to the array of comments.*/
  public pushComment() {
    // Don't push a new comment if the input is just spaces.
    if (this.newCommentText.trim()) {
      this.commentService.addComment(this.newCommentText);
      this.newCommentText = '';
    }
  }

  /**
   * Allow the user to navigate the list of potential mentions with various keys
   * and then select their target mention with the Enter key.
   *
   * @param {KeyboardEvent} event
   */
  @HostListener('document:keydown', ['$event'])
  public handleKeyDown(event: KeyboardEvent) {
    const d = document.getElementById('commentDialog') as HTMLDialogElement;
    if (!d.open) {
      if (
        (event.key === 'Enter' && event.shiftKey) ||
        (event.key === 'Enter' && event.ctrlKey)
      ) {
        event.preventDefault();
        d.close();
        this.pushComment();
      }
    }
  }
}
