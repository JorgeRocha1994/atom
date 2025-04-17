import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogTaskComponent } from '@shared/components/dialog-task/dialog-task.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from '@domain/models/task.model';

describe('DialogTaskComponent', () => {
  let component: DialogTaskComponent;
  let fixture: ComponentFixture<DialogTaskComponent>;

  const mockDialogRef = { close: jest.fn() };
  const mockData: Task = {
    id: '1',
    name: 'Original Task',
    detail: 'Some detail',
    createdAt: new Date(),
    completed: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogTaskComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and load the initial data', () => {
    expect(component).toBeTruthy();
    expect(component.data).toEqual(mockData);
    expect(component.detail()).toBe(mockData.detail);
  });

  it('should close the dialog with updated data when form is valid', () => {
    component.inputForm = {
      isValid: () => true,
      getValue: jest.fn(() => 'Updated Task'),
    } as any;

    component.textareaForm = {
      getValue: jest.fn(() => 'Updated Detail'),
    } as any;

    component.onConfirm();

    expect(mockDialogRef.close).toHaveBeenCalledWith({
      id: '1',
      name: 'Updated Task',
      detail: 'Updated Detail',
    });
  });

  it('should not close the dialog if the form is invalid', () => {
    component.inputForm = {
      isValid: () => false,
      getValue: jest.fn(),
    } as any;

    component.textareaForm = {
      getValue: jest.fn(),
    } as any;

    mockDialogRef.close.mockClear();
    component.onConfirm();

    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });

  it('should close the dialog without returning data on cancel', () => {
    component.onNoClick();
    expect(mockDialogRef.close).toHaveBeenCalledWith();
  });
});
