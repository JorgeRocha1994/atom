import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputFormComponent } from '@shared/components/input-form/input-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('InputFormComponent', () => {
  let component: InputFormComponent;
  let fixture: ComponentFixture<InputFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputFormComponent, ReactiveFormsModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(InputFormComponent);
    component = fixture.componentInstance;
    component.placeholder = 'Test input';
    component.required = true;
    component.minLength = 3;
    component.maxLength = 10;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should return the trimmed value from getValue()', () => {
    component.inputControl.setValue('   Hello World  ');
    expect(component.getValue()).toBe('Hello World');
  });

  it('should return false when required field is empty', () => {
    component.inputControl.setValue('');
    expect(component.isValid()).toBe(false);
    expect(component.errorMessage()).toBe('The value is required');
  });

  it('should return false when value is shorter than the minimum length', () => {
    component.inputControl.setValue('a');
    expect(component.isValid()).toBe(false);
    expect(component.errorMessage()).toContain('at least');
  });

  it('should return false when value exceeds the maximum length', () => {
    component.inputControl.setValue('This value is tooooooo long');
    expect(component.isValid()).toBe(false);
    expect(component.errorMessage()).toContain('characters or fewer');
  });

  it('should not emit value when Enter is pressed and input is invalid', () => {
    const emitSpy = jest.spyOn(component.enterPressed, 'emit');
    component.inputControl.setValue('');
    component.onEnter();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should clear the input and error on reset()', () => {
    component.inputControl.setValue('Hello World');
    component.errorMessage.set('Error');
    component.reset();
    expect(component.inputControl.value).toBe('');
    expect(component.errorMessage()).toBe('');
  });
});
