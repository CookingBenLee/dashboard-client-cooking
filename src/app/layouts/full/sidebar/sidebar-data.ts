import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  // {
  //   navCap: 'Home',
  // },
  {
    displayName: "Ma page d'accueil",
    iconName: 'solar:widget-add-line-duotone',
    route: 'home/dashboard',
  },
  {
    displayName: 'Planification de Repas',
    iconName: 'solar:calendar-mark-outline',
    route: 'home/ui-components/badge',
    children: [
      {
        displayName: 'Planifier un repas',
        route: 'home/ui-components/badge',
      },
      {
        displayName: 'Liste des planifications',
        route: 'home/ui-components/badge',
      },
    ],
  },
  {
    displayName: 'Mes Plats',
    iconName: 'material-symbols:dining',
    route: 'home/ui-components/chips',
  },
  {
    displayName: 'Mes Recettes',
    iconName: 'arcticons:reciper',
    route: 'home/ui-components/lists',

  },
  {
    displayName: 'Mes Ingrédients',
    iconName: 'mingcute:components-line',
    route: 'home/ui-components/menu',
    children: [
      {
        displayName: 'Mes Produits',
        route: 'home/ui-components/menu',
      },
      {
        displayName: 'Catégorie',
        route: 'home/ui-components/menu',
      },
      {
        displayName: 'Unité',
        route: 'home/ui-components/menu',
      },
      {
        displayName: 'Marque',
        route: 'home/ui-components/menu',
      },
      {
        displayName: 'Conditionnement',
        route: 'home/ui-components/menu',
      },
      {
        displayName: 'Catalogue de prix',
        route: 'home/ui-components/menu',
      },
    ],
  },
  {
    displayName: 'Les Fournisseurs',
    iconName: 'solar:user-hands-bold',
    route: 'home/ui-components/tooltips',
  },
  // {
  //   displayName: 'Forms',
  //   iconName: 'solar:file-text-line-duotone',
  //   route: '/ui-components/forms',
  // },
  // {
  //   displayName: 'Tables',
  //   iconName: 'solar:tablet-line-duotone',
  //   route: '/ui-components/tables',
  // },
  // {
  //   navCap: 'Auth',
  //   divider: true
  // },
  // {
  //   displayName: 'Login',
  //   iconName: 'solar:login-3-line-duotone',
  //   route: '/authentication/login',
  // },
  // {
  //   displayName: 'Register',
  //   iconName: 'solar:user-plus-rounded-line-duotone',
  //   route: '/authentication/register',
  // },
  // {
  //   navCap: 'Extra',
  //   divider: true
  // },
  // {
  //   displayName: 'Icons',
  //   iconName: 'solar:sticker-smile-circle-2-line-duotone',
  //   route: '/extra/icons',
  // },
  // {
  //   displayName: 'Sample Page',
  //   iconName: 'solar:planet-3-line-duotone',
  //   route: '/extra/sample-page',
  // },
];
