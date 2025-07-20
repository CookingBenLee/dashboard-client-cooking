import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BrandingComponent } from './branding.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { NavItem } from './nav-item/nav-item';
import { navItems } from './sidebar-data';

import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [BrandingComponent, TablerIconsModule, MaterialModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  authService: any;
  constructor(private tokenService:TokenService) { }
  @Input() showToggle = true;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  filteredNavItems: NavItem[] = [];
  
  ngOnInit(): void {
    const user = this.tokenService.getUser();
    const userTypeCompte = Number(user?.compteUser?.typeCompte?.id) || 1;
    console.log("Type de Compte : ", userTypeCompte);
        
    this.filteredNavItems = this.filterNavItems(navItems, userTypeCompte);
    console.log("Comparaison : ", this.filteredNavItems);
  }
  
  filterNavItems(items: NavItem[], userTypeCompte: number): NavItem[] {
    return items
      .filter(item => {
        if (item.typeCompte && !item.typeCompte.includes(userTypeCompte)) {
          return false;
        }
        return true;
      })
      .map(item => {
        if (item.children) {
          return { ...item, children: this.filterNavItems(item.children, userTypeCompte) };
        }
        return item;
      });
  }
  
  
  
}