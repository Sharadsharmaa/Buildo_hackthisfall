import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { OwlModule } from 'ngx-owl-carousel';
import { QuicklinkModule } from 'ngx-quicklink';
@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    OwlModule,
    QuicklinkModule
  ]
})
export class HomeModule { }
