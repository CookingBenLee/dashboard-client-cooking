import { NgModule, LOCALE_ID, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, registerLocaleData, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import localeFr from '@angular/common/locales/fr';
import { PlanningComponent } from './planning.component';
import { NouvellePlanificationComponent } from './nouvelle-planification/nouvelle-planification.component';

registerLocaleData(localeFr);

@NgModule({
  declarations: [
    // PlanningComponent,
    // NouvellePlanificationComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    DatePipe
  ],
  exports: [
    // PlanningComponent,
    // NouvellePlanificationComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PlanningModule { } 