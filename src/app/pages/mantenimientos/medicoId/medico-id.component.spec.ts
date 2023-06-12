import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicoIdComponent } from './medico-id.component';

describe('MedicoIdComponent', () => {
  let component: MedicoIdComponent;
  let fixture: ComponentFixture<MedicoIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicoIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicoIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
