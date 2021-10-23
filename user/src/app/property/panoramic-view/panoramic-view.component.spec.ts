import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanoramicViewComponent } from './panoramic-view.component';

describe('PanoramicViewComponent', () => {
  let component: PanoramicViewComponent;
  let fixture: ComponentFixture<PanoramicViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanoramicViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanoramicViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
