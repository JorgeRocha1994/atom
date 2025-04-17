import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'textarea-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './textarea-form.component.html',
  styleUrl: './textarea-form.component.css',
})
export class TextareaFormComponent {
  @Input({ required: true }) placeholder: string = 'Write something...';
  @Input() nonNullable: boolean = false;
  @Input() minLength: number | null = null;
  @Input() maxLength: number | null = null;
  @Input() value: string | null = null;

  @Output() enterPressed = new EventEmitter();
  @Output() valueChanged = new EventEmitter<string>();

  errorMessage = signal<string>('');
  areaControl!: FormControl<string | null>;

  ngOnInit(): void {
    this.areaControl = new FormControl<string>(this.value ?? '', {
      nonNullable: this.nonNullable,
    });
  }

  getValue(): string {
    return this.areaControl.value?.trim() ?? '';
  }

  reset(): void {
    this.areaControl.setValue('');
  }
}
