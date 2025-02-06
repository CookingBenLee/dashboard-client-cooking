import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { TranslocoModule } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [RouterModule, MaterialModule,TranslocoModule],
  templateUrl: './error.component.html',
})
export class AppErrorComponent {

   ngOnInit(): void {
    // this.user = this.tokenService.getUser();
    }
  
    logout(): void {
      console.log("desconnexion");
  
      this.tokenService.signOut();
      this.router.navigate(['/login']);
    }
  

  
    constructor(
      public dialog: MatDialog,  
      private tokenService: TokenService,
      public router: Router
    ) {
    }
  
}
