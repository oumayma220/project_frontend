import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonPathViewerComponent } from './json-path-viewer.component';

describe('JsonPathViewerComponent', () => {
  let component: JsonPathViewerComponent;
  let fixture: ComponentFixture<JsonPathViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonPathViewerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JsonPathViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
