import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShoppingPage } from './shopping.page';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

describe('ShoppingPage', () => {
  let component: ShoppingPage;
  let fixture: ComponentFixture<ShoppingPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShoppingPage],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ShoppingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
