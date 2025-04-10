import {
  byTestId,
  createRoutingFactory,
  Spectator,
} from '@ngneat/spectator/jest';
import { CartService } from '@shared/services/cart.service';
import { HeaderComponent } from './header.component';
import { SearchComponent } from '../search/search.component';
import { Product } from '@shared/models/product.model';
import { generateFakeProduct } from '@shared/models/product.mock';

describe('HeaderComponent', () => {
  let spectator: Spectator<HeaderComponent>;
  let cartService: CartService;

  const createComponent = createRoutingFactory({
    component: HeaderComponent,
    imports: [SearchComponent],
    declarations: [],
    providers: [CartService],
  });

  beforeEach(() => {
    spectator = createComponent();
    cartService = spectator.inject(CartService);
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('Menu Toggling', () => {
    it('should toggle mobile menu visibility', () => {
      const initialValue = spectator.component.showMenu();
      spectator.component.toggleMenu();
      expect(spectator.component.showMenu()).toBe(!initialValue);
    });

    it('should toggle side menu visibility', () => {
      const initialValue = spectator.component.hideSideMenu();
      spectator.component.toogleSideMenu();
      expect(spectator.component.hideSideMenu()).toBe(!initialValue);
    });
  });

  describe('Cart Functionality', () => {
    it('should display cart count correctly', () => {
      const mockProducts: Product[] = [
        generateFakeProduct(),
        generateFakeProduct(),
      ];
      cartService.cart.set(mockProducts);
      spectator.detectChanges();

      const cartCountElement = spectator.query('.absolute.-top-2.-left-2');
      expect(cartCountElement).toHaveText('2');
    });

    it('should display empty cart count as 0', () => {
      cartService.cart.set([]);
      spectator.detectChanges();

      const cartCountElement = spectator.query('.absolute.-top-2.-left-2');
      expect(cartCountElement).toHaveText('0');
    });

    it('should display cart total correctly', () => {
      const mockProducts: Product[] = [
        generateFakeProduct({ price: 100 }),
        generateFakeProduct({ price: 200 }),
      ];
      cartService.cart.set(mockProducts);
      spectator.detectChanges();

      const totalElement = spectator.query(byTestId('total'));
      expect(totalElement).toBeTruthy();
      expect(totalElement).toHaveText('Total: 300');
    });
  });

  describe('Navigation', () => {
    it('should have correct navigation links', () => {
      const links = spectator.queryAll('a[routerLink]');
      expect(links.length).toBe(4);
      expect(links[0]).toHaveText('Home');
      expect(links[1]).toHaveText('About');
      expect(links[2]).toHaveText('Locations');
      expect(links[3]).toHaveText('Services');
    });

    it('should have active link styling', () => {
      const links = spectator.queryAll('a[routerLink]');
      links.forEach(link => {
        expect(link).toHaveClass('hover:underline');
      });
    });
  });

  describe('Responsive Behavior', () => {
    it('should show mobile menu button on small screens', () => {
      const menuButton = spectator.query(
        '[data-collapse-toggle="navbar-default"]'
      );
      expect(menuButton).toHaveClass('md:hidden');
    });

    it('should show desktop menu on large screens', () => {
      const desktopMenu = spectator.query('.md\\:flex-row');
      expect(desktopMenu).toBeTruthy();
      expect(desktopMenu).toHaveClass('md:flex-row');
    });
  });
});
