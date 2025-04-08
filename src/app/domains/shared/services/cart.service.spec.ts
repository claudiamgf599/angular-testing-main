import { TestBed } from '@angular/core/testing';
import { generateFakeProduct } from '@shared/models/product.mock';
import { Product } from '../models/product.model';
import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;
  let mockProduct: Product;
  let mockProduct2: Product;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartService],
    });
    service = TestBed.inject(CartService);

    // Reset the cart before each test
    service.cart.set([]);

    // Create mock products
    mockProduct = generateFakeProduct({ price: 100 });
    mockProduct2 = generateFakeProduct({ price: 200 });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('cart signal', () => {
    it('should initialize with empty array', () => {
      expect(service.cart()).toEqual([]);
    });
  });

  describe('total computed', () => {
    it('should calculate total correctly for single product', () => {
      service.addToCart(mockProduct);
      expect(service.total()).toBe(100);
    });

    it('should calculate total correctly for multiple products', () => {
      service.addToCart(mockProduct);
      service.addToCart(mockProduct2);
      expect(service.total()).toBe(300);
    });

    it('should return 0 for empty cart', () => {
      expect(service.total()).toBe(0);
    });

    it('should handle products with zero price', () => {
      const freeProduct = generateFakeProduct({ price: 0 });
      service.addToCart(freeProduct);
      expect(service.total()).toBe(0);
    });
  });

  describe('addToCart', () => {
    it('should add a product to the cart', () => {
      service.addToCart(mockProduct);
      expect(service.cart()).toContain(mockProduct);
      expect(service.cart().length).toBe(1);
    });

    it('should allow adding multiple products', () => {
      service.addToCart(mockProduct);
      service.addToCart(mockProduct2);
      expect(service.cart().length).toBe(2);
      expect(service.cart()).toContain(mockProduct);
      expect(service.cart()).toContain(mockProduct2);
    });

    it('should maintain order of added products', () => {
      service.addToCart(mockProduct);
      service.addToCart(mockProduct2);
      expect(service.cart()[0]).toBe(mockProduct);
      expect(service.cart()[1]).toBe(mockProduct2);
    });

    it('should handle adding the same product multiple times', () => {
      service.addToCart(mockProduct);
      service.addToCart(mockProduct);
      expect(service.cart().length).toBe(2);
      expect(service.cart()[0]).toBe(mockProduct);
      expect(service.cart()[1]).toBe(mockProduct);
    });
  });
});
