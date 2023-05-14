import { CategoryEntity } from 'src/categories/entities/category.entity';

export const categoryStub = (): CategoryEntity => {
  return {
    id: 1,
    title: 'Category 1',
    items: [
      {
        id: 1,
        title: 'Title 1',
        isAvailable: true,
        user: null,
        description: 'Description 1',
        category: null,
        againstCategory: null,
        slug: 'title-1',
        files: [],
        createdAt: null,
        updatedAt: null,
        deletedAt: null,
      },
    ],
    againstItems: [
      {
        id: 2,
        title: 'Title 2',
        isAvailable: true,
        user: null,
        description: 'Description 2',
        category: null,
        againstCategory: null,
        slug: 'title-2',
        files: [],
        createdAt: null,
        updatedAt: null,
        deletedAt: null,
      },
    ],
  };
};
