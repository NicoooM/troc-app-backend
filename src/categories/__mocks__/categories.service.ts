import { updateStub } from '../../../test/stubs/common.stub';
import { categoryStub } from '../test/stubs/category.stub';

export const CategoriesService = jest.fn().mockReturnValue({
  findAll: jest.fn().mockResolvedValue([categoryStub()]),
  findOne: jest.fn().mockResolvedValue(categoryStub()),
  create: jest.fn().mockResolvedValue(categoryStub()),
  update: jest.fn().mockResolvedValue(updateStub()),
  remove: jest.fn().mockResolvedValue(categoryStub()),
});
