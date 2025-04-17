import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextareaFormComponent } from '@shared/components/textarea-form/textarea-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('TextareaFormComponent', () => {
  let component: TextareaFormComponent;
  let fixture: ComponentFixture<TextareaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextareaFormComponent, ReactiveFormsModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TextareaFormComponent);
    component = fixture.componentInstance;
    component.placeholder = 'Write a comment...';
    component.minLength = 3;
    component.maxLength = 100;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should return the trimmed value', () => {
    component.areaControl.setValue('   hello world   ');
    expect(component.getValue()).toBe('hello world');
  });

  it('should return an empty string when the value is null', () => {
    component.areaControl.setValue(null);
    expect(component.getValue()).toBe('');
  });

  it('should emit valueChanged with the current value', () => {
    const emitSpy = jest.spyOn(component.valueChanged, 'emit');
    component.areaControl.setValue('testing');
    component.valueChanged.emit(component.getValue());
    expect(emitSpy).toHaveBeenCalledWith('testing');
  });

  it('should reset the control value to an empty string', () => {
    component.areaControl.setValue('reset');
    component.reset();
    expect(component.areaControl.value).toBe('');
  });
});
