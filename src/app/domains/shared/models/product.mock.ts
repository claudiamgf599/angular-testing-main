import { faker } from '@faker-js/faker';
import { Product } from './product.model';
import { generateFakeCategory } from '@shared/services/category.mocks';

export const generateFakeProduct = (data?: Partial<Product>): Product => ({
  id: faker.number.int(),
  title: faker.commerce.productName(),
  price: parseFloat(faker.commerce.price()),
  description: faker.commerce.productDescription(),
  category: generateFakeCategory(),
  images: [faker.image.url(), faker.image.url()],
  creationAt: faker.date.past().toISOString(),
  slug: faker.lorem.slug(),
  ...data,
});
