import { Routes } from '@angular/router';
import { StarterComponent } from './starter/starter.component';
import { PlanningComponent } from './planning/planning.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    component: StarterComponent,
    data: {
      title: 'Starter',
      urls: [
        { title: 'Dashboard', url: '/starter' },
        { title: 'Starter' },
      ],
    },
  },
  {
    path: 'planning',
    component: PlanningComponent,
    data: {
      title: 'Mes Planifications',
      urls: [
        { title: 'Dashboard', url: '/planning' },
        { title: 'Mes Planifications' },
      ],
    },
  },
];
