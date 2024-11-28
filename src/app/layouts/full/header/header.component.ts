import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  OnInit,
} from '@angular/core';
import { MaterialModule } from 'src/app/material.module';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatButtonModule } from '@angular/material/button';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, NgScrollbarModule, MaterialModule, MatButtonModule],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})

export class HeaderComponent implements OnInit{
  user: any

  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  constructor(private userService: UserService, private tokenService: TokenService, private router: Router) {}

  ngOnInit(): void {
    this.user=this.tokenService.getUser()
    console.log(this.user);

  }


  // getCurrentUser(): void {
  //   this.user = this.tokenService.getUser();
  //   console.log('Utilisateur connecté :', this.user);
  // }


  logout(): void {
    console.log("desconnexion");

    this.tokenService.signOut();
    this.router.navigate(['/login']);
  }
}
