import { Injectable } from '@angular/core';

export interface Comment {
  id: number;
  text: string;
}

export interface User {
  userID: number;
  name: string;
}

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
  ];

  getComments() {
    return this.comments;
  }

  getUsers() {
    return this.users;
  }

  addComment(text: string) {
    const users = this.detectUserMentions(text);
    const comment: Comment = {
      id: this.comments.length + 1,
      text,
    };
    this.comments.push(comment);
    if (users.length) {
      console.log(
        `The users mentioned were ${users.map((u) => u.name).join(', ')}.`
      );
    }
  }

  detectUserMentions(text: string): User[] {
    const mentionPattern = /@(\w+)/g;
    let match;
    const mentionedUsers: User[] = [];

    while ((match = mentionPattern.exec(text)) !== null) {
      const userName = match[1];
      const user = this.users.find(
        (user) => user.name.toLowerCase() === userName.toLowerCase()
      );
      if (user) {
        mentionedUsers.push(user);
      }
    }

    return mentionedUsers;
  }
}
