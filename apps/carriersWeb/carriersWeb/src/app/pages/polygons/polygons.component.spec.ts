import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolygonsComponent } from './polygons.component';

describe('PolygonsComponent', () => {
  let component: PolygonsComponent;
  let fixture: ComponentFixture<PolygonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolygonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolygonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
