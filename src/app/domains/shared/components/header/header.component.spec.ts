import { createRoutingFactory, Spectator } from '@ngneat/spectator/jest';
import { CartService } from '@shared/services/cart.service';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let spectator: Spectator<HeaderComponent>;

  const createComponent = createRoutingFactory({
    component: HeaderComponent,
    providers: [CartService],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
