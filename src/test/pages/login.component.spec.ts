import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from '@pages/login/login.component';
import { UserUseFacade } from '@application/facades/user.facade';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

const mockUserUseFacade = {
  create: jest.fn(),
  get: jest.fn(),
};

const mockSnackBar = {
  open: jest.fn(),
};

const mockRouter = {
  navigate: jest.fn(),
};

const mockDialogRef = {
  afterClosed: () => of(true),
};

const mockDialog = {
  open: jest.fn(() => mockDialogRef),
};

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: UserUseFacade, useValue: mockUserUseFacade },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: Router, useValue: mockRouter },
        { provide: MatDialog, useValue: mockDialog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    component.inputForm = {
      isValid: jest.fn(),
      getValue: jest.fn(),
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not sign up when input is invalid', async () => {
    (component.inputForm.isValid as jest.Mock).mockReturnValue(false);

    await component.signUp();
    expect(mockUserUseFacade.create).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should complete sign up successfully', async () => {
    (component.inputForm.isValid as jest.Mock).mockReturnValue(true);
    (component.inputForm.getValue as jest.Mock).mockReturnValue(
      'test@example.com'
    );

    mockUserUseFacade.create.mockResolvedValue({
      id: '1',
      token: 'token',
      email: 'test@example.com',
      expiresAt: new Date(),
    });

    await component.signUp();
    expect(mockUserUseFacade.create).toHaveBeenCalled();
    expect(mockSnackBar.open).toHaveBeenCalledWith('Welcome!', '', {
      duration: 3000,
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show error if sign up fails', async () => {
    (component.inputForm.isValid as jest.Mock).mockReturnValue(true);
    (component.inputForm.getValue as jest.Mock).mockReturnValue(
      'test@example.com'
    );
    mockUserUseFacade.create.mockRejectedValue(new Error('Signup failed'));

    await component.signUp();
    expect(mockSnackBar.open).toHaveBeenCalledWith('Signup failed', '', {
      duration: 3000,
    });
  });

  it('should sign in if user exists', async () => {
    mockUserUseFacade.get.mockResolvedValue({
      id: '1',
      token: 'token',
      email: 'test@example.com',
      expiresAt: new Date(),
    });

    await component.signIn('test@example.com');
    expect(mockUserUseFacade.get).toHaveBeenCalledWith('test@example.com');
    expect(mockSnackBar.open).toHaveBeenCalledWith('Welcome back!', '', {
      duration: 3000,
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should create account if user not found and confirms dialog', async () => {
    mockUserUseFacade.get.mockResolvedValue(null);
    mockDialog.open.mockReturnValue({ afterClosed: () => of(true) } as any);
    jest.spyOn(component, 'signUp').mockResolvedValue();

    await component.signIn('new@example.com');
    expect(mockDialog.open).toHaveBeenCalled();
    expect(component.signUp).toHaveBeenCalled();
  });

  it('should not create account if dialog is cancelled', async () => {
    mockUserUseFacade.get.mockResolvedValue(null);
    mockDialog.open.mockReturnValue({ afterClosed: () => of(false) } as any);
    jest.spyOn(component, 'signUp');

    await component.signIn('new@example.com');
    expect(component.signUp).not.toHaveBeenCalled();
  });

  it('should show error if sign in fails', async () => {
    mockUserUseFacade.get.mockRejectedValue(new Error('SignIn failed'));
    await component.signIn('error@example.com');
    expect(mockSnackBar.open).toHaveBeenCalledWith('SignIn failed', '', {
      duration: 3000,
    });
  });

  it('should not sign in when input is invalid', async () => {
    (component.inputForm.isValid as jest.Mock).mockReturnValue(false);
    await component.signInHandler();
    expect(mockUserUseFacade.get).not.toHaveBeenCalled();
  });
});
