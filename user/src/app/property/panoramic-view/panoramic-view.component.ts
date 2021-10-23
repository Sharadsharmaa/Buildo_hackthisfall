import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var PANOLENS:any;


@Component({
  selector: 'app-panoramic-view',
  templateUrl: './panoramic-view.component.html',
  styleUrls: ['./panoramic-view.component.scss']
})
export class PanoramicViewComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    let container = document.querySelector("#container");
    let viewer = new PANOLENS.Viewer({
      output: "console",
      // controlButtons: [],
      cameraFov: 65,
      horizontalView: false,
      verticalView:false,
      container: container,
      autoHideInfospot: false,
      // autoRotate: true
    });

    let entrancePanorama = new PANOLENS.ImagePanorama("assets/renders/Essence-min.jpg");
    viewer.add(entrancePanorama);
  }

}
