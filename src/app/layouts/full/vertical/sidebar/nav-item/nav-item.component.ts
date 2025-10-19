import {
  Component,
  HostBinding,
  Input,
  OnInit,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { NavItem } from './nav-item';
import { Router } from '@angular/router';
import { NavService } from '../../../../../services/nav.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { TranslateModule } from '@ngx-translate/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [TranslateModule, TablerIconsModule, MaterialModule, CommonModule],
  templateUrl: './nav-item.component.html',
  styleUrls: [],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ]),
  ],
})
export class AppNavItemComponent implements OnChanges {
  @Output() toggleMobileLink: any = new EventEmitter<void>();
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  expanded: any = false;
  disabled: any = false;
  twoLines: any = false;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: NavItem | any;
  @Input() depth: any;

  constructor(public navService: NavService, public router: Router) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  ngOnChanges() {
    const url = this.navService.currentUrl(); 
    if (this.item.route && url) {
      this.expanded = url.indexOf(`/${this.item.route}`) === 0;
      this.ariaExpanded = this.expanded;
    }
  }

  onItemSelected(item: NavItem) {
    console.log('🔗 Clic sur élément de navigation:', item);
    console.log('🔗 Route demandée:', item.route);
    console.log('🔗 A des enfants?', item.children && item.children.length);
    
    if (!item.children || !item.children.length) {
      console.log('🚀 Navigation vers:', item.route);
      console.log('🚀 Router navigate appelé avec:', [item.route]);
      
      // Test de navigation avec URL complète
      const fullRoute = `/home/${item.route}`;
      console.log('🚀 Tentative avec URL complète:', fullRoute);
      
      this.router.navigate([fullRoute]).then(
        (success) => {
          console.log('✅ Navigation réussie avec URL complète:', success);
        },
        (error) => {
          console.error('❌ Erreur navigation URL complète:', error);
          // Fallback vers navigation relative
          console.log('🔄 Fallback vers navigation relative...');
          this.router.navigate([item.route]).then(
            (success) => console.log('✅ Navigation relative réussie:', success),
            (error) => console.error('❌ Erreur navigation relative:', error)
          );
        }
      );
      
    }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
    //scroll
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    if (!this.expanded){
    if (window.innerWidth < 1024) {
      this.notify.emit();
    }
  }
  }

  onSubItemSelected(item: NavItem) {
    if (!item.children || !item.children.length){
      if (this.expanded && window.innerWidth < 1024) {
        this.notify.emit();
      }
    }
  }
}
