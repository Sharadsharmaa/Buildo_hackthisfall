import { Component, OnInit } from '@angular/core';
import { BuildingService } from '../core/services/building.service';
import * as Leaflet from 'leaflet';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss']
})
export class PropertyComponent implements OnInit {
  map!: Leaflet.Map;
  buildings:any=[]
  constructor(
    private buildingService: BuildingService,
  ) { }

  ngOnInit(): void {
    this.map = Leaflet.map('map').setView([28.644800, 77.216721], 5);
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    }).addTo(this.map);

    Leaflet.marker([28.6, 77]).addTo(this.map).bindPopup('Delhi').openPopup();
    Leaflet.marker([34, 77]).addTo(this.map).bindPopup('Leh').openPopup();

     this.buildingList();
  }
  buildingList(){
    this.buildingService.buildingList().subscribe( res =>{
      console.log( res.data);
      if(res.statusCode === 200){
        this.buildings=res.data;
      } else {
        alert("error");
      }
    })
  }
}
