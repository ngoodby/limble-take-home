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
  showUserDropdown = false;
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
    const secondLastChar = value.slice(-2, -1);
    if (
      lastChar === '@' &&
      (secondLastChar === ' ' || secondLastChar === '') &&
      !this.showUserDropdown
    ) {
      this._openUserDropdown();
    }
  }

  private _openUserDropdown() {
    this.showUserDropdown = true;
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
      this.showUserDropdown = false;
    }
  }

  private _closeDropdownIfSpaceTyped(value: string, atIndex: number) {
    if (value.slice(atIndex + 1).includes(' ')) {
      this.showUserDropdown = false;
    }
  }

  /**
   * Identify the target mention, close mention dropdown, and move focus back to the input.
   *
   * @public
   * @param {User} user
   */
  public selectUser(user: User) {
    this._addMentionToComment(user);
    this.showUserDropdown = false;
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
    if (this.showUserDropdown) {
      if (
        event.key === 'ArrowDown' ||
        event.key === 'ArrowRight' ||
        (event.key === 'Tab' && !event.shiftKey)
      ) {
        event.preventDefault();
        this._moveSelection('down');
      } else if (
        event.key === 'ArrowUp' ||
        event.key === 'ArrowLeft' ||
        (event.key === 'Tab' && event.shiftKey)
      ) {
        event.preventDefault();
        this._moveSelection('up');
      } else if (event.key === 'Escape') {
        this.activeUserID = null;
        this.showUserDropdown = false;
      } else if (event.key === 'Enter') {
        event.preventDefault();
        if (this.activeUserID !== null) {
          const selectedUser = this.filteredUsers.find(
            user => user.userID === this.activeUserID
          );
          if (selectedUser) {
            this.selectUser(selectedUser);
          }
        }
        // Reset the activeUserID once the mention is selected.
        this.activeUserID = null;
      }
    } else {
      if (
        (event.key === 'Enter' && event.shiftKey) ||
        (event.key === 'Enter' && event.ctrlKey)
      ) {
        event.preventDefault();
        this.pushComment();
      }
    }
  }

  /**
   * Helper function to update the activeUserID to keep track of which target mention
   * the user is highlighting in the dropdown.
   *
   * @private
   * @param {('up' | 'down')} direction
   */
  private _moveSelection(direction: 'up' | 'down') {
    if (this.filteredUsers.length === 0) {
      return;
    }
    const currentIndex = this.filteredUsers.findIndex(
      user => user.userID === this.activeUserID
    );
    let nextIndex: number;
    if (direction === 'down') {
      nextIndex = (currentIndex + 1) % this.filteredUsers.length;
    } else {
      // 'up'
      nextIndex =
        (currentIndex - 1 + this.filteredUsers.length) %
        this.filteredUsers.length;
    }
    this.activeUserID = this.filteredUsers[nextIndex].userID;
    this._scrollActiveUserIntoView();
  }

  private _scrollActiveUserIntoView() {
    const activeElement = document.getElementById(
      `userID-${this.activeUserID}`
    );
    if (activeElement) {
      activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /**
   * Close user dropdown menu when user clicks outside of it.
   *
   * @param {MouseEvent} event
   */
  @HostListener('document:click', ['$event'])
  public clickOutsideDropdown(event: MouseEvent) {
    const userDropdown = document.getElementById('userDropdown');
    if (userDropdown) {
      const dropdownDimensions = userDropdown.getBoundingClientRect();
      if (
        event.clientX < dropdownDimensions.left ||
        event.clientX > dropdownDimensions.right ||
        event.clientY < dropdownDimensions.top ||
        event.clientY > dropdownDimensions.bottom
      ) {
        this.showUserDropdown = false;
      }
    }
  }
}
