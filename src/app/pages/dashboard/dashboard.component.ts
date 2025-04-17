import {
  Component,
  signal,
  Injector,
  inject,
  effect,
  ViewChild,
  computed,
} from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Task } from '@domain/models/task.model';
import { TextareaFormComponent } from '@shared/components/textarea-form/textarea-form.component';
import { InputFormComponent } from '@shared/components/input-form/input-form.component';
import { DialogTaskComponent } from '@shared/components/dialog-task/dialog-task.component';
import { Filters, Order } from '@shared/utils/enums';
import { TaskUseFacade } from '@application/facades/task.facade';
import { AuthTokenService } from '@core/services/auth-token.service';

@Component({
  selector: 'dashboard',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    InputFormComponent,
    TextareaFormComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private effectInject = inject(Injector);
  private taskUse = inject(TaskUseFacade);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private auth = inject(AuthTokenService);
  private lastFilter = '';
  private lastOrder = '';

  myTasks = signal<Task[]>([]);

  availableFilters = Filters;
  selectedFilter = signal<Filters>(Filters.All);
  selectedOrder = signal<Order>(Order.Ascending);

  email: string = this.auth.getEmail() ?? '';

  @ViewChild(InputFormComponent) inputForm!: InputFormComponent;
  @ViewChild(TextareaFormComponent) textareaForm!: TextareaFormComponent;

  ngOnInit() {
    this.initTasks();
  }

  initTasks() {
    effect(
      () => {
        const filter = this.selectedFilter();
        const order = this.selectedOrder();

        this.loadTasks(filter, order);
      },
      { injector: this.effectInject }
    );
  }

  sortedTasks = computed(() => this.sortTasks(this.myTasks()));

  async loadTasks(filter: Filters, order: Order) {
    try {
      if (filter === this.lastFilter && order === this.lastOrder) return;

      this.lastFilter = filter;
      this.lastOrder = order;

      const tasks = await this.taskUse.get(filter, order);
      this.myTasks.set(tasks);
    } catch (error: any) {
      this.snackBar.open(error.message, '', { duration: 3000 });
    }
  }

  applyFilter(filter: keyof typeof Filters = 'All') {
    const newFilter = Filters[filter];
    if (this.selectedFilter() !== newFilter) {
      this.selectedFilter.set(newFilter);
    }
  }

  applyOrder() {
    this.selectedOrder.set(
      this.selectedOrder() === Order.Descending
        ? Order.Ascending
        : Order.Descending
    );
  }

  private sortTasks(tasks: Task[]): Task[] {
    const currentOrder = this.selectedOrder();
    return [...tasks].sort((a, b) => {
      const aDate = new Date(a.createdAt).getTime();
      const bDate = new Date(b.createdAt).getTime();
      return currentOrder === Order.Ascending ? aDate - bDate : bDate - aDate;
    });
  }

  async addTask(name: string) {
    try {
      const taskCreated = await this.taskUse.create({
        name,
        detail: this.textareaForm.getValue(),
      });

      if (taskCreated) {
        this.myTasks.set([...this.myTasks(), taskCreated]);
        this.inputForm.reset();
        this.textareaForm.reset();
      }
    } catch (error: any) {
      this.snackBar.open(error.message, '', { duration: 3000 });
    }
  }

  async addTaskHandler() {
    const inputTaskValid = this.inputForm?.isValid();

    if (!inputTaskValid) {
      return;
    }

    const name = this.inputForm.getValue();
    await this.addTask(name);
  }

  private replaceTask(updated: Task) {
    this.myTasks.update((tasks) =>
      this.sortTasks(tasks.map((t) => (t.id === updated.id ? updated : t)))
    );
  }

  async completeTask(task: Task) {
    try {
      const taskToggled = await this.taskUse.toggle(task.id);
      if (taskToggled) {
        this.replaceTask(taskToggled);
      }
    } catch (error: any) {
      this.snackBar.open(error.message, '', { duration: 3000 });
    }
  }

  openDialog(task: Task): void {
    if (task.completed) {
      this.snackBar.open('It is not possible to edit completed tasks', '', {
        duration: 3000,
      });
      return;
    }

    const dialogRef = this.dialog.open(DialogTaskComponent, {
      data: task,
      width: '600px',
    });

    dialogRef.afterClosed().subscribe({
      next: async (result: Task) => {
        if (!result) return;

        try {
          const taskUpdated = await this.taskUse.update(result);
          if (taskUpdated) {
            this.replaceTask(taskUpdated);
          }
        } catch (error: any) {
          this.snackBar.open(error.message, '', { duration: 3000 });
        }
      },
      error: () => {
        this.snackBar.open('Failed to update task', '', { duration: 3000 });
      },
    });
  }

  async deleteTask(task: Task) {
    try {
      const taskDeleted = await this.taskUse.delete(task.id);
      if (taskDeleted) {
        const deletedTasks = this.myTasks().filter((t) => t.id !== task.id);
        this.myTasks.set(this.myTasks().filter((t) => t.id !== task.id));
      }
    } catch (error: any) {
      this.snackBar.open(error.message, '', { duration: 3000 });
    }
  }

  async clearCompleted() {
    const completedTasks = this.myTasks().filter((t) => t.completed);

    const deletionResults = await Promise.allSettled(
      completedTasks.map((t) => this.taskUse.delete(t.id))
    );

    const deletedIds = completedTasks
      .filter((_, i) => deletionResults[i].status === 'fulfilled')
      .map((t) => t.id);

    const updatedTasks = this.myTasks().filter(
      (t) => !deletedIds.includes(t.id)
    );

    this.myTasks.set(updatedTasks);

    const failed = deletionResults.filter((t) => t.status === 'rejected');
    if (failed.length > 0) {
      this.snackBar.open(`Some tasks could not be deleted`, '', {
        duration: 3000,
      });
    }
  }
}
