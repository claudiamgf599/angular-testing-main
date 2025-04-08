import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from '@ngneat/spectator/jest';
import { ProductService } from './product.service';
import { environment } from '@env/environment';
import { Product } from '../models/product.model';

describe('ProductService', () => {
  let spectator: SpectatorHttp<ProductService>;
  const createHttp = createHttpFactory(ProductService);

  beforeEach(() => {
    spectator = createHttp();
  });

  describe('getProducts', () => {
    it('debería obtener productos sin parámetros', () => {
      spectator.service.getProducts({}).subscribe();

      const url = `${environment.apiUrl}/api/v1/products`;
      spectator.expectOne(url, HttpMethod.GET);
    });

    it('debería obtener productos con parámetro category_id', () => {
      const categoryId = '123';
      spectator.service.getProducts({ category_id: categoryId }).subscribe();

      const url = `${environment.apiUrl}/api/v1/products?categoryId=${categoryId}`;
      spectator.expectOne(url, HttpMethod.GET);
    });

    it('debería obtener productos con parámetro category_slug', () => {
      const categorySlug = 'electronica';
      spectator.service
        .getProducts({ category_slug: categorySlug })
        .subscribe();

      const url = `${environment.apiUrl}/api/v1/products?categorySlug=${categorySlug}`;
      spectator.expectOne(url, HttpMethod.GET);
    });

    it('debería obtener productos con ambos parámetros de categoría', () => {
      const categoryId = '123';
      const categorySlug = 'electronica';
      spectator.service
        .getProducts({
          category_id: categoryId,
          category_slug: categorySlug,
        })
        .subscribe();

      const url = `${environment.apiUrl}/api/v1/products?categoryId=${categoryId}&categorySlug=${categorySlug}`;
      spectator.expectOne(url, HttpMethod.GET);
    });

    it('debería manejar parámetros vacíos', () => {
      spectator.service
        .getProducts({
          category_id: '',
          category_slug: '',
        })
        .subscribe();

      const url = `${environment.apiUrl}/api/v1/products`;
      spectator.expectOne(url, HttpMethod.GET);
    });

    it('debería manejar respuesta exitosa de productos', () => {
      const mockProducts: Product[] = [
        {
          id: 1,
          title: 'Producto de Prueba',
          price: 100,
          description: 'Descripción de Prueba',
          category: {
            id: 1,
            name: 'Categoría de Prueba',
            image: 'test.jpg',
            slug: 'categoria-prueba',
          },
          images: ['test.jpg'],
          creationAt: new Date().toISOString(),
          slug: 'producto-prueba',
        },
      ];

      spectator.service.getProducts({}).subscribe(response => {
        expect(response).toEqual(mockProducts);
      });

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/products`,
        HttpMethod.GET
      );
      req.flush(mockProducts);
    });

    it('debería manejar error en la respuesta', () => {
      const errorResponse = {
        status: 404,
        statusText: 'No Encontrado',
        error: { message: 'No se encontraron productos' },
      };

      spectator.service.getProducts({}).subscribe({
        error: error => {
          expect(error.status).toBe(404);
          expect(error.error.message).toBe('No se encontraron productos');
        },
      });

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/products`,
        HttpMethod.GET
      );
      req.flush('No se encontraron productos', errorResponse);
    });
  });

  describe('getOne', () => {
    it('debería obtener un producto por id', () => {
      const productId = '123';
      spectator.service.getOne(productId).subscribe();

      const url = `${environment.apiUrl}/api/v1/products/${productId}`;
      spectator.expectOne(url, HttpMethod.GET);
    });

    it('debería manejar id vacío', () => {
      spectator.service.getOne('').subscribe();

      const url = `${environment.apiUrl}/api/v1/products/`;
      spectator.expectOne(url, HttpMethod.GET);
    });

    it('debería manejar respuesta exitosa de un producto', () => {
      const mockProduct: Product = {
        id: 1,
        title: 'Producto de Prueba',
        price: 100,
        description: 'Descripción de Prueba',
        category: {
          id: 1,
          name: 'Categoría de Prueba',
          image: 'test.jpg',
          slug: 'categoria-prueba',
        },
        images: ['test.jpg'],
        creationAt: new Date().toISOString(),
        slug: 'producto-prueba',
      };

      spectator.service.getOne('1').subscribe(response => {
        expect(response).toEqual(mockProduct);
      });

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/products/1`,
        HttpMethod.GET
      );
      req.flush(mockProduct);
    });

    it('debería manejar error cuando el producto no existe', () => {
      const errorResponse = {
        status: 404,
        statusText: 'No Encontrado',
        error: { message: 'Producto no encontrado' },
      };

      spectator.service.getOne('999').subscribe({
        error: error => {
          expect(error.status).toBe(404);
          expect(error.error.message).toBe('Producto no encontrado');
        },
      });

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/products/999`,
        HttpMethod.GET
      );
      req.flush('Producto no encontrado', errorResponse);
    });
  });

  describe('getOneBySlug', () => {
    it('debería obtener un producto por slug', () => {
      const slug = 'producto-prueba';
      spectator.service.getOneBySlug(slug).subscribe();

      const url = `${environment.apiUrl}/api/v1/products/slug/${slug}`;
      spectator.expectOne(url, HttpMethod.GET);
    });

    it('debería manejar slug vacío', () => {
      spectator.service.getOneBySlug('').subscribe();

      const url = `${environment.apiUrl}/api/v1/products/slug/`;
      spectator.expectOne(url, HttpMethod.GET);
    });

    it('debería manejar error cuando el slug no existe', () => {
      const errorResponse = {
        status: 404,
        statusText: 'No Encontrado',
        error: { message: 'Producto no encontrado' },
      };

      spectator.service.getOneBySlug('slug-inexistente').subscribe({
        error: error => {
          expect(error.status).toBe(404);
          expect(error.error.message).toBe('Producto no encontrado');
        },
      });

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/products/slug/slug-inexistente`,
        HttpMethod.GET
      );
      req.flush('Producto no encontrado', errorResponse);
    });
  });

  describe('getRelatedProducts', () => {
    it('debería obtener productos relacionados por slug', () => {
      const slug = 'producto-prueba';
      spectator.service.getRelatedProducts(slug).subscribe();

      const url = `${environment.apiUrl}/api/v1/products/slug/${slug}/related`;
      spectator.expectOne(url, HttpMethod.GET);
    });

    it('debería manejar slug vacío', () => {
      spectator.service.getRelatedProducts('').subscribe();

      const url = `${environment.apiUrl}/api/v1/products/slug//related`;
      spectator.expectOne(url, HttpMethod.GET);
    });

    it('debería manejar respuesta exitosa de productos relacionados', () => {
      const mockRelatedProducts: Product[] = [
        {
          id: 2,
          title: 'Producto Relacionado',
          price: 200,
          description: 'Descripción de Producto Relacionado',
          category: {
            id: 1,
            name: 'Categoría de Prueba',
            image: 'test.jpg',
            slug: 'categoria-prueba',
          },
          images: ['related.jpg'],
          creationAt: new Date().toISOString(),
          slug: 'producto-relacionado',
        },
      ];

      spectator.service
        .getRelatedProducts('producto-prueba')
        .subscribe(response => {
          expect(response).toEqual(mockRelatedProducts);
        });

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/products/slug/producto-prueba/related`,
        HttpMethod.GET
      );
      req.flush(mockRelatedProducts);
    });

    it('debería manejar error cuando no hay productos relacionados', () => {
      const errorResponse = {
        status: 404,
        statusText: 'No Encontrado',
        error: { message: 'No se encontraron productos relacionados' },
      };

      spectator.service
        .getRelatedProducts('producto-sin-relacionados')
        .subscribe({
          error: error => {
            expect(error.status).toBe(404);
            expect(error.error.message).toBe(
              'No se encontraron productos relacionados'
            );
          },
        });

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/products/slug/producto-sin-relacionados/related`,
        HttpMethod.GET
      );
      req.flush('No se encontraron productos relacionados', errorResponse);
    });
  });
});
