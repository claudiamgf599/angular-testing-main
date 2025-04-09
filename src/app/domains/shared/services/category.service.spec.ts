import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from '@ngneat/spectator/jest';
import { CategoryService } from './category.service';
import { environment } from '@env/environment';
import { Category } from '../models/category.model';
import { generateFakeCategory } from './category.mocks';

import { enableFetchMocks } from 'jest-fetch-mock';
enableFetchMocks();

describe('CategoryService', () => {
  let spectator: SpectatorHttp<CategoryService>;
  const createHttp = createHttpFactory(CategoryService);

  beforeEach(() => {
    spectator = createHttp();
    fetchMock.resetMocks();
  });

  describe('getAll', () => {
    it('debería obtener todas las categorías', () => {
      spectator.service.getAll().subscribe();

      const url = `${environment.apiUrl}/api/v1/categories`;
      spectator.expectOne(url, HttpMethod.GET);
    });

    it('debería manejar respuesta exitosa de categorías', () => {
      const mockCategories: Category[] = [
        generateFakeCategory(),
        generateFakeCategory(),
        generateFakeCategory(),
      ];

      spectator.service.getAll().subscribe(response => {
        expect(response).toEqual(mockCategories);
      });

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/categories`,
        HttpMethod.GET
      );
      req.flush(mockCategories);
    });

    it('debería manejar error en la respuesta cuando la api falla', () => {
      const errorMessage = 'API Error';

      spectator.service.getAll().subscribe({
        error: error => {
          expect(error.status).toBe(errorMessage);
        },
      });

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/categories`,
        HttpMethod.GET
      );
      req.flush(null, { status: 500, statusText: errorMessage });
    });

    it('debería manejar error en la respuesta', () => {
      const errorResponse = {
        status: 404,
        statusText: 'No Encontrado',
        error: { message: 'No se encontraron categorías' },
      };

      spectator.service.getAll().subscribe({
        error: error => {
          expect(error.status).toBe(404);
          expect(error.error.message).toBe('No se encontraron categorías');
        },
      });

      const req = spectator.expectOne(
        `${environment.apiUrl}/api/v1/categories`,
        HttpMethod.GET
      );
      req.flush('No se encontraron categorías', errorResponse);
    });
  });

  describe('getAllPromise', () => {
    const url = `${environment.apiUrl}/api/v1/categories`;

    it('debería obtener todas las categorías usando fetch', async () => {
      const mockCategories: Category[] = [
        generateFakeCategory(),
        generateFakeCategory(),
        generateFakeCategory(),
      ];

      // Mock global fetch - preferimos usar fetchmock sobre usar la global
      /*
      global.fetch = jest.fn().mockImplementation(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockCategories),
        })
      );*/

      fetchMock.mockResponseOnce(JSON.stringify(mockCategories));

      const result = await spectator.service.getAllPromise();
      expect(result).toEqual(mockCategories);
      expect(fetchMock).toHaveBeenCalledWith(url);
      /*
      expect(global.fetch).toHaveBeenCalledWith(
        `${environment.apiUrl}/api/v1/categories`
      );*/
    });

    it('debería manejar network error en la respuesta de fetch', async () => {
      const errorMessage = 'Error al obtener categorías';
      /*
      global.fetch = jest
        .fn()
        .mockImplementation(() => Promise.reject(new Error(errorMessage)));*/

      fetchMock.mockRejectOnce(new Error(errorMessage));

      await expect(spectator.service.getAllPromise()).rejects.toThrow(
        errorMessage
      );
      expect(fetch).toHaveBeenCalledWith(url);
    });

    it('debería manejar error al parsear el JSON en Promise', async () => {
      const errorMessage = 'Invalid JSON';

      fetchMock.mockRejectOnce(new Error(errorMessage));

      await expect(spectator.service.getAllPromise()).rejects.toThrow(
        errorMessage
      );
      expect(fetch).toHaveBeenCalledWith(url);
    });

    it('debería manejar respuesta vacía', async () => {
      fetchMock.mockResponseOnce(JSON.stringify([]));

      const result = await spectator.service.getAllPromise();
      expect(result).toEqual([]);
      expect(fetchMock).toHaveBeenCalledWith(url);
    });
  });
});
