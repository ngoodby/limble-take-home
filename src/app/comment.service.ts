import { Injectable } from '@angular/core';

export interface Comment {
  id: number;
  text: string;
  userID: number | null;
}

export interface User {
  userID: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private comments: Comment[] = [];
  private users: User[] = [
    { userID: 1, name: 'Kevin' },
    { userID: 2, name: 'Jeff' },
    { userID: 3, name: 'Bryan' },
    { userID: 4, name: 'Gabbey' }
  ];

  getComments() {
    return this.comments;
  }

  getUsers() {
    return this.users;
  }

  addComment(text: string) {
    const user = this.detectUserMention(text);
    const comment: Comment = {
      id: this.comments.length + 1,
      text,
      userID: user ? user.userID : null
    };
    this.comments.push(comment);
    if (user) {
      this.alertUser(user);
    }
  }

  detectUserMention(text: string): User | null {
    const mentionPattern = /@(\w+)/;
    const match = mentionPattern.exec(text);
    if (match) {
      const userName = match[1];
      return this.users.find(user => user.name.toLowerCase() === userName.toLowerCase()) || null;
    }
    return null;
  }

  alertUser(user: User) {
    alert(`User ${user.name} was mentioned!`);
  }
}
