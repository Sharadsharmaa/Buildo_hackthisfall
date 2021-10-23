import { Component, OnInit } from '@angular/core';
import { BuildingService } from '../../core/services/building.service';
import { NgxUiLoaderService } from "ngx-ui-loader";
import {
  Engine,
  Scene,
  Color4,
  Mesh,
  Vector3,
  SceneLoader,
  HemisphericLight,
  ArcRotateCamera,
  ActionManager,
  ExecuteCodeAction,
} from '@babylonjs/core';
import '@babylonjs/loaders/';
import '@babylonjs/serializers'
import "@babylonjs/inspector";
import * as Leaflet from 'leaflet';
import {ActivatedRoute} from '@angular/router';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  buildingDetail: any;
  modelPath: string = 'assets/models/Early Skyscraper.glb';
  project_price = [
    { price: 50000, area: 250 },
    { price: 100000, area: 450 },
    { price: 200000, area: 950 },

  ];
  activePrice = 0;
  map!: Leaflet.Map;
  modelLoadingProgress: number = 1;
  constructor(
    private buildingService: BuildingService,
    private spinner: NgxUiLoaderService,
    private route: ActivatedRoute,

  ) { }

  ngOnInit(): void {
    this.map = Leaflet.map('map').setView([28.644800, 77.216721], 5);
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    }).addTo(this.map);

    Leaflet.marker([28.6, 77]).addTo(this.map).bindPopup('Delhi').openPopup();
    Leaflet.marker([34, 77]).addTo(this.map).bindPopup('Leh').openPopup();
    sessionStorage.setItem("model", this.modelPath)
    this.renderModel();
    let property_id;
    this.route.params.subscribe(params => {
      property_id = params['type'];
    });
    this.getBuildingDetail(property_id)
  }

  getBuildingDetail(_id:any){
    this.spinner.start();

    this.buildingService.buildingDetail({_id}).subscribe( res =>{
      if(res.statusCode === 200){
        this.spinner.stop();
        this.buildingDetail = res.data;
    sessionStorage.setItem("model", res.data.resourceUrl)
  } else {
        this.spinner.stop();
      }
    })
  }

  changePrice(event: any): void {
    let activePrice = this.project_price.find((area) => {
      return area.area === event.target.value;
    });
    this.activePrice = <number>activePrice?.price;
  }

  ngOnDestroy(): void {
    this.map.remove();
  }

  renderModel(): void {
    const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
    const engine = new Engine(canvas);
    var scene = new Scene(engine);
    var camera = new ArcRotateCamera("Camera", 1.95, 1.2, 200, Vector3.Zero(), scene);
    // camera.rotation.x = Math.PI / 4;
    camera.speed = 1;
    camera.fov = 0.30;
    camera.position.y = -0.942;
    // scene.debugLayer.show();
    camera.useAutoRotationBehavior = true;
    camera.autoRotationBehavior!.idleRotationSpeed = 0.1;
    scene.clearColor = new Color4(0, 0, 0, 0);

    camera.attachControl(canvas, false);
    let light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    SceneLoader.LoadAssetContainer("", this.modelPath, scene, (container) => {
      let mesh = container.meshes[0];
      mesh.position.y = -20
      container.addAllToScene();

    }, (evt) => {
      if (evt.lengthComputable) {
        this.modelLoadingProgress = +(evt.loaded * 100 / evt.total).toFixed();
      } else {
        let dlCount = evt.loaded / (1024 * 1024);
        this.modelLoadingProgress = Math.floor(dlCount * 100.0) / 100.0;
      }
    });
    engine.runRenderLoop(() => {
      scene.render();
    })
    window.addEventListener('resize', () => {
      engine.resize();
    });
  }


}
