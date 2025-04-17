import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'input-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './input-form.component.html',
  styleUrl: './input-form.component.css',
})
export class InputFormComponent {
  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;

  @Output() enterPressed = new EventEmitter();
  @Input({ required: true }) type: string = 'text';
  @Input({ required: true }) required: boolean = false;
  @Input({ required: true }) placeholder: string = 'Write something...';
  @Input() minLength: number | null = null;
  @Input() maxLength: number | null = null;
  @Input() value: string | null = null;

  private patternByType: Record<string, RegExp> = {
    text: /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ.,\-()\/]+$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  };

  errorMessage = signal<string>('');
  inputControl!: FormControl<string>;

  ngOnInit(): void {
    const validators = [];

    if (this.required) validators.push(Validators.required);

    const pattern = this.patternByType[this.type];
    if (pattern) validators.push(Validators.pattern(pattern));

    if (this.minLength) validators.push(Validators.minLength(this.minLength));
    if (this.maxLength) validators.push(Validators.maxLength(this.maxLength));

    this.inputControl = new FormControl<string>(this.value ?? '', {
      nonNullable: true,
      validators,
    });
  }

  private setErrorMessage(message: string): void {
    this.errorMessage.set(message);
    this.inputRef?.nativeElement.focus();
  }

  private getTaskInputError(): void {
    const control = this.inputControl;

    if (control.hasError('required')) {
      this.setErrorMessage('The value is required');
    }

    if (control.hasError('pattern')) {
      this.setErrorMessage('Only valid characters are allowed');
    }

    if (control.hasError('minlength')) {
      this.setErrorMessage(
        `The value must have at least ${this.minLength} characters`
      );
    }

    if (control.hasError('maxlength')) {
      this.setErrorMessage(
        `The value must be ${this.maxLength} characters or fewer`
      );
    }
  }

  onEnter() {
    const isValid = this.isValid();
    if (!isValid) {
      return;
    }

    const value = this.getValue();
    if (value) {
      this.enterPressed.emit(value);
    }
  }

  isValid(): boolean {
    const value = this.getValue();
    this.inputControl.setValue(value);
    if (!this.inputControl.valid) {
      this.getTaskInputError();
      return false;
    }

    return true;
  }

  getValue(): string {
    return this.inputControl.value?.trim() ?? '';
  }

  reset(): void {
    this.inputControl.setValue('');
    this.setErrorMessage('');
  }
}
