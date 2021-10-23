import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PropertyRoutingModule } from './property-routing.module';
import { PropertyComponent } from './property.component';
import { PanoramicViewComponent } from './panoramic-view/panoramic-view.component';
import { DetailComponent } from './detail/detail.component';
import { ArViewComponent } from './ar-view/ar-view.component';
import { QuicklinkModule } from 'ngx-quicklink';


@NgModule({
  declarations: [
    PropertyComponent,
    PanoramicViewComponent,
    DetailComponent,
    ArViewComponent
  ],
  imports: [
    CommonModule,
    PropertyRoutingModule,
    QuicklinkModule
  ],
  exports:[QuicklinkModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})


export class PropertyModule { }
