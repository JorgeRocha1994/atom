import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;

  const mockDialogRef = { close: jest.fn() };
  const mockData = {
    title: 'Create User',
    message: 'Are you sure you want to create a new user?',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and load the dialog data', () => {
    expect(component).toBeTruthy();
    expect(component.data).toEqual(mockData);
  });

  it('should close the dialog with true when confirming', () => {
    const confirmButton = fixture.debugElement.nativeElement.querySelector(
      'button.confirm-button'
    );
    confirmButton.click();
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should close the dialog with false when cancelling', () => {
    const cancelButton = fixture.debugElement.nativeElement.querySelector(
      'button.cancel-button'
    );
    cancelButton.click();
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });
});
