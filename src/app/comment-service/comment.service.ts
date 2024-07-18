import { Injectable } from '@angular/core';
import { User, Comment } from './comment.types';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private comments: Comment[] = [];
  private users: User[] = [
    { userID: 1, name: 'Kevin' },
    { userID: 2, name: 'Jeff' },
    { userID: 3, name: 'Bryan' },
    { userID: 4, name: 'Gabbey' },
    {userID: 5, name: 'Linh'},
    {userID: 6, name: 'Erin'}
  ];

  getComments() {
    return this.comments;
  }

  getUsers() {
    return this.users;
  }

  /**
   * Add a comment to the comments array. Detects mentions within the comment to
   * allow for any desired side effects to be triggered.
   *
   * @param {string} text
   */
  addComment(text: string) {
    const users = this.detectUserMentions(text);
    const comment: Comment = {
      id: this.comments.length + 1,
      text,
    };
    this.comments.push(comment);
    if (users.length) {
      console.log(
        `The users mentioned were ${users.map((u) => u.name).join(', ')}.`,
      );
    }
  }

  /**
   * Detect mentions within a comment.
   *
   * @param {string} text
   * @returns {User[]}
   */
  detectUserMentions(text: string): User[] {
    const mentionPattern = /@(\w+)/g;
    let match;
    const mentionedUsers: User[] = [];

    while ((match = mentionPattern.exec(text)) !== null) {
      const userName = match[1];
      const user = this.users.find(
        (user) => user.name.toLowerCase() === userName.toLowerCase(),
      );
      if (user) {
        mentionedUsers.push(user);
      }
    }

    return mentionedUsers;
  }
}
