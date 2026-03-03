import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { AnalyticsDashboardComponent } from './components/analytics-dashboard/analytics-dashboard.component';
import { MenuManagementComponent } from './components/menu-management/menu-management.component';
import { PredictionDashboardComponent } from './components/prediction-dashboard/prediction-dashboard.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'analytics', component: AnalyticsDashboardComponent },
  { path: 'menu', component: MenuManagementComponent },
  { path: 'prediction', component: PredictionDashboardComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
