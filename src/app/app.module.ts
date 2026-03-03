import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { AnalyticsDashboardComponent } from './components/analytics-dashboard/analytics-dashboard.component';
import { FloatingCalculatorComponent } from './components/floating-calculator/floating-calculator.component';
import { MenuManagementComponent } from './components/menu-management/menu-management.component';
import { PredictionChatbotComponent } from './components/prediction-chatbot/prediction-chatbot.component';
import { PredictionDashboardComponent } from './components/prediction-dashboard/prediction-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    AnalyticsDashboardComponent,
    FloatingCalculatorComponent,
    MenuManagementComponent,
    PredictionChatbotComponent,
    PredictionDashboardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
