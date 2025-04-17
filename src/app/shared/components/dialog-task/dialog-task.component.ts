import { Component, inject, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Task } from '@domain/models/task.model';

import { InputFormComponent } from '@shared/components/input-form/input-form.component';
import { TextareaFormComponent } from '@shared/components/textarea-form/textarea-form.component';

@Component({
  selector: 'dialog-task',
  standalone: true,
  templateUrl: 'dialog-task.component.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    InputFormComponent,
    TextareaFormComponent,
  ],
})
export class DialogTaskComponent {
  readonly dialogRef = inject(MatDialogRef<DialogTaskComponent>);
  readonly data = inject<Task>(MAT_DIALOG_DATA);
  readonly detail = signal(this.data.detail);

  @ViewChild(InputFormComponent) inputForm!: InputFormComponent;
  @ViewChild(TextareaFormComponent) textareaForm!: TextareaFormComponent;

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    if (!this.inputForm.isValid()) return;

    const name = this.inputForm.getValue();
    const detail = this.textareaForm.getValue();

    this.dialogRef.close({
      id: this.data.id,
      name,
      detail,
    });
  }
}
