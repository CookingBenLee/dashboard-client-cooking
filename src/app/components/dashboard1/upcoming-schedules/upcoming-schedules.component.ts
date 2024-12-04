import { Component } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatTabsModule } from '@angular/material/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
    selector: 'app-upcoming-schedules',
    standalone: true,
    imports: [
        MaterialModule,
        MatMenuModule,
        MatButtonModule,
        CommonModule,
        TablerIconsModule,
        MatTabsModule,
        NgScrollbarModule        
    ],
    templateUrl: './upcoming-schedules.component.html',
})
export class AppUpcomingSchedulesComponent {


    constructor() { }
}
