import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConferenceDetails } from './conference-details';

describe('ConferenceDetails', () => {
  let component: ConferenceDetails;
  let fixture: ComponentFixture<ConferenceDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConferenceDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(ConferenceDetails);
    fixture.componentRef.setInput('conference', { nom: 'Angular', date: '2024-06-01', lieu: 'Paris' });
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
