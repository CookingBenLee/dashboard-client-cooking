import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'solar:widget-add-line-duotone',
    route: 'home/dashboard',
  },
  {
    navCap: 'Ui Components',
    divider: true
  },
  {
    displayName: 'Planification de Repas',
    iconName: 'solar:calendar-mark-outline',
    route: 'home/ui-components/badge',
  },
  {
    displayName: 'Mes Plats',
    iconName: 'solar:danger-circle-line-duotone',
    route: 'home/ui-components/chips',
  },
  {
    displayName: 'Mes Recettes',
    iconName: 'solar:bookmark-square-minimalistic-line-duotone',
    route: 'home/ui-components/lists',
  },
  {
    displayName: 'Mes Ingrédients',
    iconName: 'solar:file-text-line-duotone',
    route: 'home/ui-components/menu',
  },
  {
    displayName: 'Les Fournisseurs',
    iconName: 'solar:text-field-focus-line-duotone',
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
