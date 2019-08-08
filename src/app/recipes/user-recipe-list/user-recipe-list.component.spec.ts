import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRecipeListComponent } from './user-recipe-list.component';

describe('UserRecipeListComponent', () => {
  let component: UserRecipeListComponent;
  let fixture: ComponentFixture<UserRecipeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRecipeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRecipeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
