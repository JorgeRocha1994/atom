import { Component, inject, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { InputFormComponent } from '@shared/components/input-form/input-form.component';
import { UserUseFacade } from '@application/facades/user.facade';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'login',
  standalone: true,
  imports: [InputFormComponent, MatIconModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private userUse = inject(UserUseFacade);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  @ViewChild(InputFormComponent) inputForm!: InputFormComponent;

  async signUp() {
    try {
      const inputTaskValid = this.inputForm.isValid();

      if (!inputTaskValid) {
        return;
      }

      const email = this.inputForm.getValue();
      const userCreated = await this.userUse.create(email);

      if (userCreated) {
        this.snackBar.open('Welcome!', '', { duration: 3000 });
        this.router.navigate(['/dashboard']);
      }
    } catch (error: any) {
      this.snackBar.open(error.message, '', { duration: 3000 });
    }
  }

  async signIn(email: string) {
    try {
      const userCreated = await this.userUse.get(email);

      if (userCreated) {
        this.snackBar.open('Welcome back!', '', { duration: 3000 });
        this.router.navigate(['/dashboard']);
      } else {
        const createNewUser = await this.openConfirmDialog();
        if (createNewUser) {
          await this.signUp();
        }
      }
    } catch (error: any) {
      this.snackBar.open(error.message, '', { duration: 3000 });
    }
  }

  async signInHandler() {
    const inputTaskValid = this.inputForm.isValid();

    if (!inputTaskValid) {
      return;
    }

    const email = this.inputForm.getValue();
    await this.signIn(email);
  }

  openConfirmDialog(): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Create User',
        message: 'Are you sure you want to create a new user?',
      },
    });

    return dialogRef.afterClosed().toPromise();
  }
}
