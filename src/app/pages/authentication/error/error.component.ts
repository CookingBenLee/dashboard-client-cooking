import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [RouterModule, MaterialModule,TranslocoModule],
  templateUrl: './error.component.html',
})
export class AppErrorComponent {}
