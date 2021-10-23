import { Component, OnInit } from '@angular/core';
import '@google/model-viewer';

@Component({
  selector: 'app-ar-view',
  templateUrl: './ar-view.component.html',
  styleUrls: ['./ar-view.component.scss']
})
export class ArViewComponent implements OnInit {
  modelPath = "assets/models/Early Skyscraper.glb" || sessionStorage.getItem("model");
  constructor() { }

  ngOnInit(): void {
    // const model =<any> document.createElement('model-viewer');
    // model.src = 'assets/models/Astronaut.glb';

    // document.body.appendChild(model);
  }

}
