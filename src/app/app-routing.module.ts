import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule'
  },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'mytripsheet', loadChildren: './mytripsheet/mytripsheet.module#MytripsheetPageModule' },
  { path: 'detail', loadChildren: './detail/detail.module#DetailPageModule' },
  { path: 'qrscan', loadChildren: './qrscan/qrscan.module#QrscanPageModule' },
  { path: 'mytripsummary', loadChildren: './mytripsummary/mytripsummary.module#MytripsummaryPageModule' },
  { path: 'update', loadChildren: './update/update.module#UpdatePageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
 })
export class AppRoutingModule {}
