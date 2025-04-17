import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { TaskUseFacade } from '@application/facades/task.facade';
import { AuthTokenService } from '@core/services/auth-token.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Task } from '@domain/models/task.model';
import { Filters, Order } from '@shared/utils/enums';
import { of } from 'rxjs';

const mockTaskUseFacade = {
  get: jest.fn(),
  create: jest.fn(),
  toggle: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockAuthService = {
  getEmail: jest.fn(() => 'test@example.com'),
};

const mockSnackBar = {
  open: jest.fn(),
};

const mockDialogRef = {
  afterClosed: () =>
    of({
      id: '1',
      name: 'Updated',
      createdAt: new Date(),
      detail: '',
      completed: false,
    }),
};

const mockDialog = {
  open: jest.fn(() => mockDialogRef),
};

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: TaskUseFacade, useValue: mockTaskUseFacade },
        { provide: AuthTokenService, useValue: mockAuthService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: MatDialog, useValue: mockDialog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should load tasks on initialization', async () => {
    const tasks: Task[] = [
      {
        id: '1',
        name: 'Task',
        createdAt: new Date(),
        detail: '',
        completed: false,
      },
    ];

    mockTaskUseFacade.get.mockResolvedValueOnce(tasks);

    await component.loadTasks(Filters.All, Order.Ascending);

    expect(component.myTasks()).toEqual(tasks);
  });

  it('should add a new task successfully', async () => {
    const task: Task = {
      id: '1',
      name: 'New Task',
      createdAt: new Date(),
      detail: '',
      completed: false,
    };

    mockTaskUseFacade.create.mockResolvedValueOnce(task);

    component.textareaForm = {
      getValue: () => 'Detail',
      reset: jest.fn(),
    } as any;

    component.inputForm = {
      reset: jest.fn(),
    } as any;

    await component.addTask('New Task');

    expect(component.myTasks()).toContain(task);
  });

  it('should mark a task as completed', async () => {
    const task: Task = {
      id: '1',
      name: 'Task',
      createdAt: new Date(),
      detail: '',
      completed: false,
    };

    const toggled: Task = { ...task, completed: true };

    component.myTasks.set([task]);
    mockTaskUseFacade.toggle.mockResolvedValueOnce(toggled);

    await component.completeTask(task);

    expect(component.myTasks()).toContain(toggled);
  });

  it('should open dialog and process task update', async () => {
    const task: Task = {
      id: '1',
      name: 'Task',
      createdAt: new Date(),
      detail: '',
      completed: false,
    };

    const updated: Task = { ...task, name: 'Updated' };

    component.myTasks.set([task]);
    mockTaskUseFacade.update.mockResolvedValueOnce(updated);

    component.openDialog(task);

    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should delete a task and remove it from the list', async () => {
    const task: Task = {
      id: '1',
      name: 'Task',
      createdAt: new Date(),
      detail: '',
      completed: false,
    };

    component.myTasks.set([task]);
    mockTaskUseFacade.delete.mockResolvedValueOnce(true);

    await component.deleteTask(task);

    expect(component.myTasks()).not.toContain(task);
  });

  it('should show an error if delete fails', async () => {
    const task: Task = {
      id: '1',
      name: 'Task',
      createdAt: new Date(),
      detail: '',
      completed: false,
    };

    component.myTasks.set([task]);
    mockTaskUseFacade.delete.mockRejectedValueOnce(new Error('Delete failed'));

    await component.deleteTask(task);

    expect(mockSnackBar.open).toHaveBeenCalledWith('Delete failed', '', {
      duration: 3000,
    });
  });

  it('should clear all completed tasks', async () => {
    const tasks: Task[] = [
      {
        id: '1',
        name: 'Done',
        createdAt: new Date(),
        detail: '',
        completed: true,
      },
      {
        id: '2',
        name: 'Active',
        createdAt: new Date(),
        detail: '',
        completed: false,
      },
    ];

    component.myTasks.set(tasks);
    mockTaskUseFacade.delete.mockResolvedValueOnce(true);

    await component.clearCompleted();
    expect(component.myTasks().length).toBe(1);
    expect(component.myTasks()[0].id).toBe('2');
  });
});
