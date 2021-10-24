import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PropertyComponent } from './property.component';
import { PanoramicViewComponent } from './panoramic-view/panoramic-view.component';
import { DetailComponent } from './detail/detail.component';
import { ArViewComponent } from './ar-view/ar-view.component';

const routes: Routes = [
  { path: '', component: PropertyComponent },
  { path: 'panoramic-view',data: { header: false, footer: false }, component: PanoramicViewComponent },
  { path: 'detail',data: { header: true, footer: true }, component: DetailComponent },
  { path: 'ar-view',data: { header: false, footer: false }, component: ArViewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropertyRoutingModule { }
