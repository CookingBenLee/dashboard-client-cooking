import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { AuthGuard } from './guards/auth.guard';
import { Component } from '@angular/core';
import { AcceuilComponent } from './pages/acceuil/acceuil.component';
import { ProductComponent } from './pages/product/product.component';
import { CatalogueDePrixComponent } from './pages/catalogue-de-prix/catalogue-de-prix.component';
import { CourseComponent } from './pages/course/course.component';
import { DetailpurchsaeComponent } from './pages/course/detailpurchsae/detailpurchsae.component';
import { FournisseurComponent } from './pages/fournisseur/fournisseur.component';
import { PlatComponent } from './pages/plat/plat.component';
import { RepasComponent } from './pages/repas/repas.component';
import { PlanificationComponent } from './pages/planification/planification.component';
import { RecetteComponent } from './pages/recette/recette.component';
import { RecipeComponent } from './pages/recipe/recipe.component';
import { LoginGuard } from './guards/login.guard';
import { NewSimulationEconomiqueComponent } from './pages/planification/new-simulation-economique/new-simulation-economique.component';
import { ListSimulationEconomiqueComponent } from './pages/planification/list-simulation-economique/list-simulation-economique.component';
import { PlanningComponent } from './pages/planning/planning.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard],

  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'home',
    component: FullComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'acceuil',
        pathMatch: 'full',
      },
      {
        path:"acceuil",
        component: AcceuilComponent
      },
      {
        path: "product",
        component: ProductComponent
      },
      {

        path:"catalogue-de-prix",
        component: CatalogueDePrixComponent
      },
      {
        path:"course",
        component: CourseComponent
      },
      {
        path: "fournisseur",
        component: FournisseurComponent
      },
      {
        path:'purchase/detailpurchase/:id',
        component:DetailpurchsaeComponent,
      },
      {
        path:'plat',
        component:PlatComponent,
      },
      {
        path:'repas',
        component:RepasComponent,
      },
      {
        path:'planification',
        component:ListSimulationEconomiqueComponent,
      },
      {
        path:'planifier',
        component:NewSimulationEconomiqueComponent,
      },
      {
        path:'planning',
        component:PlanningComponent,
      },
      {
        path:'recette',
        component: RecipeComponent,
      },
      {
        path: 'starter',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      {
        path: 'dashboards',
        loadChildren: () =>
          import('./pages/dashboards/dashboards.routes').then(
            (m) => m.DashboardsRoutes
          ),
      },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.routes').then(
            (m) => m.UiComponentsRoutes
          ),
      },
      {
        path: 'forms',
        loadChildren: () =>
          import('./pages/forms/forms.routes').then((m) => m.FormsRoutes),
      },
      {
        path: 'charts',
        loadChildren: () =>
          import('./pages/charts/charts.routes').then((m) => m.ChartsRoutes),
      },
      {
        path: 'apps',
        loadChildren: () =>
          import('./pages/apps/apps.routes').then((m) => m.AppsRoutes),
      },
      {
        path: 'widgets',
        loadChildren: () =>
          import('./pages/widgets/widgets.routes').then((m) => m.WidgetsRoutes),
      },
      {
        path: 'tables',
        loadChildren: () =>
          import('./pages/tables/tables.routes').then((m) => m.TablesRoutes),
      },
      {
        path: 'datatable',
        loadChildren: () =>
          import('./pages/datatable/datatable.routes').then(
            (m) => m.DatatablesRoutes
          ),
      },
      {
        path: 'theme-pages',
        loadChildren: () =>
          import('./pages/theme-pages/theme-pages.routes').then(
            (m) => m.ThemePagesRoutes
          ),
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
      {
        path: 'landingpage',
        loadChildren: () =>
          import('./pages/theme-pages/landingpage/landingpage.routes').then(
            (m) => m.LandingPageRoutes
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];
