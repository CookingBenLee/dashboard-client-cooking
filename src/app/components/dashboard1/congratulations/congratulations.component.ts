import { Component } from '@angular/core';
import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-congratulations',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './congratulations.component.html',
})
export class AppCongratulationsComponent {
  constructor() {}
}
