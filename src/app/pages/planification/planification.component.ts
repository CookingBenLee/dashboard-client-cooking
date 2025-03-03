import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Brand } from 'src/app/services/brand/Brand';
import { BrandService } from 'src/app/services/brand/brand.service';
import { Category } from 'src/app/services/category/Category';
import { CategoryService } from 'src/app/services/category/category.service';
import { Conditioning } from 'src/app/services/conditioning/Conditioning';
import { ConditioningService } from 'src/app/services/conditioning/conditioning.service';
import { ProductService } from 'src/app/services/product/product.service';
import { TableShortService } from 'src/app/services/tableShort/table-short.service';
import { Unit } from 'src/app/services/unit/Unit';
import { UnitService } from 'src/app/services/unit/unit.service';
import { PaginateService } from 'src/app/services/paginate/paginate.service';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { Product } from 'src/app/entity/Product';

// prime
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { TreeSelectModule } from 'primeng/treeselect';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { SidebarModule } from 'primeng/sidebar';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { TabViewModule } from 'primeng/tabview';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { ListboxModule } from 'primeng/listbox';
import { CalendarModule } from 'primeng/calendar';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { EditorModule } from 'primeng/editor';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { TokenService } from 'src/app/services/token/token.service';
import { Dishes } from 'src/app/services/dishes/Dishes';
import { DishesPriceService } from 'src/app/services/dishes/dishes-price.service';
import { DishesService } from 'src/app/services/dishes/dishes.service';
import { CategoryOperation } from 'src/app/services/categoryOperation/category-operation';
import { CategoryOperationService } from 'src/app/services/categoryOperation/category-operation.service';
import { ECategoryOperation } from 'src/app/services/categoryOperation/ECategoryOperation';
import { PriceFormaterDirective } from 'src/app/directives/priceFormater/price-formater.directive';
import { ListSimulationEconomiqueComponent } from './list-simulation-economique/list-simulation-economique.component';
import { NewSimulationEconomiqueComponent } from './new-simulation-economique/new-simulation-economique.component';

@Component({
  selector: 'app-planification',
  standalone: true,
  imports: [FormsModule,RouterModule,CalendarModule,
    InputTextModule,InputTextareaModule,
    ConfirmDialogModule,DialogModule,ToastModule,SliderModule,NewSimulationEconomiqueComponent,ListSimulationEconomiqueComponent,
    CommonModule,TableModule,PaginatorModule,DividerModule,TabViewModule,OverlayPanelModule],
  providers: [ConfirmationService, MessageService,DialogService],
  templateUrl: './planification.component.html',
  styleUrl: './planification.component.scss'
})
export class PlanificationComponent  {


  @ViewChild(ListSimulationEconomiqueComponent) listSimulation:ListSimulationEconomiqueComponent;

  activeIndex: number = 0;

  changeTabs(){
    if(this.activeIndex==0) {
      this.listSimulation.ngOnInit()
      this.activeIndex=1
    }
    else this.activeIndex=0
    
  }
}
