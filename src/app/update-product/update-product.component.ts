import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { Product } from 'src/app/entity/Product';
import { Category } from 'src/app/services/category/Category';
import { CategoryRecipe } from 'src/app/services/categoryrecipe/CategoryRecipe';
import { CurrencyService } from 'src/app/services/currency/currency.service';
import { DetailsRecipe } from 'src/app/services/detailsrecipe/DetailsRecipe';
import { DetailsrecipeService } from 'src/app/services/detailsrecipe/detailsrecipe.service';
import { PaginateService } from 'src/app/services/paginate/paginate.service';
import { PriceService } from 'src/app/services/price/price.service';
import { ProductService } from 'src/app/services/product/product.service';
import { Recipe } from 'src/app/services/recipe/Recipe';
import { RecipeService } from 'src/app/services/recipe/recipe.service';
import { TableShortService } from 'src/app/services/tableShort/table-short.service';
import { Unit } from 'src/app/services/unit/Unit';
import { UnitService } from 'src/app/services/unit/unit.service';

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
import { DetailsPurchasing } from 'src/app/services/detailspurchasing/DetailsPurchasing';
import { TokenService } from 'src/app/services/token/token.service';
import { CountryService } from 'src/app/services/country/country.service';
import { PaginatorModule } from 'primeng/paginator';
import { MaterialModule } from 'src/app/material.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { TreeModule } from 'primeng/tree';
import { AccordionModule } from 'primeng/accordion';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ChipModule } from 'primeng/chip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SplitButtonModule } from 'primeng/splitbutton';
import { FileUploadModule } from 'primeng/fileupload';
import { RippleModule } from 'primeng/ripple';
import { BrandService } from '../services/brand/brand.service';
import { ConditioningService } from '../services/conditioning/conditioning.service';
import { StockService } from '../services/stock/stock.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from '../services/category/category.service';
import { Brand } from '../services/brand/Brand';
import { Conditioning } from '../services/conditioning/Conditioning';
import { Currency } from '../services/currency/Currency';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [MaterialModule, MatButtonModule, MatDialogModule,CommonModule,
        RouterModule,CalendarModule ,ConfirmDialogModule,InputNumberModule,InputTextareaModule, DialogModule,ToastModule,InputTextModule,
        TableModule,PaginatorModule,DividerModule, TabViewModule,OverlayPanelModule,
      //prime module
      InputTextModule,
      TreeSelectModule,
      DropdownModule,
      CardModule,
      PasswordModule,
      PanelModule,
      SidebarModule,
      CheckboxModule,
      TabViewModule,
      ConfirmDialogModule,
      ToastModule,
      InputNumberModule,
      InputTextareaModule,
      TableModule,
      RatingModule,
      ButtonModule,
      SliderModule,
      InputTextModule,
      ToggleButtonModule,
      RippleModule,
      MultiSelectModule,
      DropdownModule,
      ProgressBarModule,
      DialogModule,
      OverlayPanelModule,
      EditorModule,
      ListboxModule,
      CalendarModule,
      DynamicDialogModule,
      DividerModule,
      FieldsetModule,
      TreeModule,
      AccordionModule,
      PanelMenuModule,
      ChipModule,
      ProgressSpinnerModule,
      SplitButtonModule,
      FileUploadModule,
      PaginatorModule],
        providers: [ConfirmationService, MessageService,DialogService],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.scss'
})
export class UpdateProductComponent implements OnInit {
  productData: any = {}
  ref: DynamicDialogRef | undefined;
  constructor(
      public dialog: MatDialog, private currencyService: CurrencyService, private stockSerevice: StockService,
      private brandService: BrandService, private conditioningService: ConditioningService, private unitService: UnitService, private categoryService: CategoryService,
      private productService: ProductService, private paginateService: PaginateService, private snackBar: MatSnackBar,
      private tokenService: TokenService, private dialogService: DialogService,
      private router: Router,public config: DynamicDialogConfig,) 
         {
          this.productData=this.config.data
          console.log(this.productData);
          
          }
  
    ngOnInit(): void {
      // this.getAll();
      this.getBrands()
      this.getCategorys()
      this.getConditioning()
      this.getUnit()
      this.getCurrency()
    }

    brands: Brand[] =[]
    getBrands() {
      this.brandService.getAllBrands().then(data => {
        console.log(data)
        this.brands = data
      })
    }
    categorys: Category[] =[]
    getCategorys() {
      this.categoryService.getAllCategorys().then(data => {
        console.log(data)
        this.categorys = data
      })
    }

    conditionings: Conditioning[] =[]
    getConditioning() {
      this.conditioningService.getAllConditionings().then(data => {
        console.log(data)
        this.conditionings = data
      })
    }

    units: Unit[] =[]
    getUnit() {
      this.unitService.getAllUnits().then(data => {
        console.log(data);
        this.units = data.filter(unit => unit.code === "Kg" || unit.code === "L");
      });
    }
    
    currencys: Currency[] = [];
    
    currency: Currency = new Currency();
    getCurrency() {
      this.currencyService.getAll().then(data => {
        console.log(data)
        this.currencys = data
      })
    }

    editProduct() {
      const user = this.tokenService.getUser();
      this.productData.compteUser = { id: user.idCompteUser };
      this.productData.product.lossPercentage = this.productData.product.lossPercentage;
      console.log("Produit modifié", this.productData.product);
    
    
      this.stockSerevice.update(this.productData.id, this.productData).then(
        () => {
          this.snackBar.open('Stock modifié avec succès !', 'Fermer', {
            duration: 2000,
            panelClass: ['snackbar-success']
          });
          // this.getAll();
          // this.dialog.closeAll();
          // this.resetFields();
          this.ref?.close;
        }).catch(err => {
          this.snackBar.open('Erreur lors de la modification du Stock.', 'Fermer', {
            duration: 2000,
            panelClass: ['snackbar-error']
          });
        }
        );
    
    
    
      this.productService.update(this.productData.product.id, this.productData.product).then(() => {
        this.snackBar.open('Produit modifié avec succès !', 'Fermer', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        // this.getAll();
        // this.dialog.closeAll();
        // this.resetFields();
        this.ref?.close;  
      }).catch(err => {
        this.snackBar.open('Erreur lors de la modification du produit.', 'Fermer', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      });
    }
}
