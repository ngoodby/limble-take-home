import { Injectable } from '@angular/core';

import { Comment, User } from './comment.types';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private _comments: Comment[] = [];
  private _users: User[] = [
    { userID: 1, name: 'Kevin' },
    { userID: 2, name: 'Jeff' },
    { userID: 3, name: 'Bryan' },
    { userID: 4, name: 'Gabbey' },
    { userID: 5, name: 'Linh' },
    { userID: 6, name: 'Erin' },
  ];

  public getComments() {
    return this._comments;
  }

  public getUsers() {
    return this._users;
  }

  /**
   * Add a comment to the comments array. Detects mentions within the comment to
   * allow for any desired side effects to be triggered.
   *
   * @public
   * @param {string} text
   */
  public addComment(text: string) {
    const users = this._detectUserMentions(text);
    const comment: Comment = {
      id: this._comments.length + 1,
      text,
    };
    this._comments.push(comment);
    if (users.length) {
      console.log(
        `The users mentioned were ${users.map(u => u.name).join(', ')}.`
      );
    }
  }

  /**
   * Detect mentions within a comment.
   *
   * @private
   * @param {string} text
   * @returns {User[]}
   */
  private _detectUserMentions(text: string): User[] {
    const mentionPattern = /@(\w+)/g;
    let match;
    const mentionedUsers: User[] = [];

    while ((match = mentionPattern.exec(text)) !== null) {
      const userName = match[1];
      const user = this._users.find(
        user => user.name.toLowerCase() === userName.toLowerCase()
      );
      if (user) {
        mentionedUsers.push(user);
      }
    }

    return mentionedUsers;
  }
}
