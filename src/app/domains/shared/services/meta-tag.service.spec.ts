import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MetaTagsService, PageMetaData } from './meta-tags.service';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '@env/environment';

describe('MetaTagsService', () => {
  let spectator: SpectatorService<MetaTagsService>;
  let metaPlatform: Meta;
  let titlePlatform: Title;
  let service: MetaTagsService;

  const mockMetaData: PageMetaData = {
    title: 'Test Title',
    description: 'Test Description',
    image: 'test-image.jpg',
    url: 'https://test-url.com',
  };

  const createService = createServiceFactory({
    service: MetaTagsService,
    providers: [
      {
        provide: Title,
        useValue: {
          setTitle: jest.fn(),
        },
      },
      {
        provide: Meta,
        useValue: {
          updateTag: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    metaPlatform = spectator.inject(Meta);
    titlePlatform = spectator.inject(Title);
    jest.clearAllMocks();
  });

  describe('updateMetaTags', () => {
    it('should update meta tags with provided data', () => {
      service.updateMetaTags(mockMetaData);

      expect(metaPlatform.updateTag).toHaveBeenCalledTimes(6);
      expect(titlePlatform.setTitle).toHaveBeenCalledWith(mockMetaData.title);

      // Verify each meta tag update
      const updateTagCalls = (metaPlatform.updateTag as jest.Mock).mock.calls;
      expect(updateTagCalls[0][0]).toEqual({
        name: 'title',
        content: mockMetaData.title,
      });
      expect(updateTagCalls[1][0]).toEqual({
        name: 'description',
        content: mockMetaData.description,
      });
      expect(updateTagCalls[2][0]).toEqual({
        property: 'og:title',
        content: mockMetaData.title,
      });
      expect(updateTagCalls[3][0]).toEqual({
        property: 'og:description',
        content: mockMetaData.description,
      });
      expect(updateTagCalls[4][0]).toEqual({
        property: 'og:image',
        content: mockMetaData.image,
      });
      expect(updateTagCalls[5][0]).toEqual({
        property: 'og:url',
        content: mockMetaData.url,
      });
    });

    it('should use default values when partial data is provided', () => {
      const partialData = {
        title: 'Custom Title',
      };

      service.updateMetaTags(partialData);

      expect(metaPlatform.updateTag).toHaveBeenCalledTimes(6);
      expect(titlePlatform.setTitle).toHaveBeenCalledWith('Custom Title');

      const updateTagCalls = (metaPlatform.updateTag as jest.Mock).mock.calls;
      expect(updateTagCalls[0][0]).toEqual({
        name: 'title',
        content: 'Custom Title',
      });
      expect(updateTagCalls[1][0]).toEqual({
        name: 'description',
        content: 'Ng Store is a store for Ng products',
      });
      expect(updateTagCalls[5][0]).toEqual({
        property: 'og:url',
        content: environment.domain,
      });
    });

    it('should handle empty meta data', () => {
      service.updateMetaTags({});

      expect(metaPlatform.updateTag).toHaveBeenCalledTimes(6);
      expect(titlePlatform.setTitle).toHaveBeenCalledWith('Ng Store');

      const updateTagCalls = (metaPlatform.updateTag as jest.Mock).mock.calls;
      expect(updateTagCalls[0][0]).toEqual({
        name: 'title',
        content: 'Ng Store',
      });
      expect(updateTagCalls[1][0]).toEqual({
        name: 'description',
        content: 'Ng Store is a store for Ng products',
      });
    });

    it('should handle undefined values in meta data', () => {
      const invalidData: Partial<PageMetaData> = {
        title: undefined,
        description: undefined,
        image: '',
        url: undefined,
      };

      service.updateMetaTags(invalidData);

      expect(metaPlatform.updateTag).toHaveBeenCalledTimes(6);
      expect(titlePlatform.setTitle).toHaveBeenCalledWith('Ng Store');

      const updateTagCalls = (metaPlatform.updateTag as jest.Mock).mock.calls;
      expect(updateTagCalls[0][0]).toEqual({
        name: 'title',
        content: 'Ng Store',
      });
      expect(updateTagCalls[1][0]).toEqual({
        name: 'description',
        content: 'Ng Store is a store for Ng products',
      });
    });

    it('should handle meta platform errors gracefully', () => {
      const error = new Error('Meta update failed');
      (metaPlatform.updateTag as jest.Mock).mockImplementation(() => {
        throw error;
      });

      expect(() => service.updateMetaTags(mockMetaData)).toThrow(
        'Meta update failed'
      );
    });
  });
});
