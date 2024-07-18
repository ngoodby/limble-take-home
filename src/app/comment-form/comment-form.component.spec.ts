import { ComponentFixture, TestBed } from '@angular/core/testing';
import CommentFormComponent from './comment-form.component';
import { FormsModule } from '@angular/forms';
import { CommentService } from '../comment-service/comment.service';
import { User } from '../comment-service/comment.types';

describe('CommentFormComponent', () => {
  const mockUsers: User[] = [
    { userID: 1, name: 'User1' },
    { userID: 2, name: 'User2' },
    { userID: 3, name: 'User3' },
  ];
  let component: CommentFormComponent;
  let fixture: ComponentFixture<CommentFormComponent>;
  let commentServiceStub: Partial<CommentService>;

  beforeEach(async () => {
    commentServiceStub = {
      getUsers: () => mockUsers,
      addComment: jasmine.createSpy('addComment'),
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, CommentFormComponent],
      providers: [{ provide: CommentService, useValue: commentServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle showUserDropdown as expected', () => {
    component.newCommentText = 'Hello @';
    component.onInput({ target: { value: 'Hello @' } });
    expect(component.showUserDropdown).toBeTrue();

    component.newCommentText = 'Hello';
    component.onInput({ target: { value: 'Hello' } });
    expect(component.showUserDropdown).toBeFalse();
  });

  it('should add user name to the comment text correctly when selectUser is called', () => {
    component.newCommentText = 'Hello @';
    component.selectUser(mockUsers[0]);
    expect(component.newCommentText).toBe('Hello @User1 ');
  });

  it('should handle key events to navigate the user dropdown list', () => {
    component.filteredUsers = mockUsers;
    component.showUserDropdown = true;
    fixture.detectChanges();

    const eventDown = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    const eventUp = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    const eventEnter = new KeyboardEvent('keydown', { key: 'Enter' });

    component.handleKeyDown(eventDown);
    expect(component.activeUserID).toBe(1); // User1

    component.handleKeyDown(eventDown);
    expect(component.activeUserID).toBe(2); // User2

    component.handleKeyDown(eventUp);
    expect(component.activeUserID).toBe(1); // User1

    component.handleKeyDown(eventEnter);
    expect(component.newCommentText).toBe('User1 ');
    expect(component.showUserDropdown).toBeFalse();
  });
});
