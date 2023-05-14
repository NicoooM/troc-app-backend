import { Test } from '@nestjs/testing';
import { CategoriesController } from '../categories.controller';
import { CategoriesService } from '../categories.service';
import { CategoryEntity } from '../entities/category.entity';
import { categoryStub } from './stubs/category.stub';
import { UpdateResult } from 'typeorm';
import { updateStub } from '../../../test/stubs/common.stub';

jest.mock('../categories.service');

describe('CategoriesController', () => {
  let categoriesController: CategoriesController;
  let categoriesService: CategoriesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [CategoriesController],
      providers: [CategoriesService],
    }).compile();

    categoriesController =
      moduleRef.get<CategoriesController>(CategoriesController);
    categoriesService = await moduleRef.resolve<CategoriesService>(
      CategoriesService,
    );
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    describe('when findAll is called', () => {
      let categories: CategoryEntity[];

      beforeEach(async () => {
        categories = await categoriesController.findAll();
      });

      test('then it should call findAll', () => {
        expect(categoriesService.findAll).toHaveBeenCalled();
      });

      test('then it should return an array of categories', () => {
        expect(categories).toEqual([categoryStub()]);
      });
    });
  });

  describe('findOne', () => {
    describe('when findOne is called', () => {
      let category: CategoryEntity;

      beforeEach(async () => {
        category = await categoriesController.findOne(
          categoryStub().id.toString(),
        );
      });

      test('then it should call findOne', () => {
        expect(categoriesService.findOne).toBeCalledWith(categoryStub().id);
      });

      test('then it should return a category', () => {
        expect(category).toEqual(categoryStub());
      });
    });
  });

  describe('create', () => {
    describe('when create is called', () => {
      let category: CategoryEntity;
      let categoryDto: CategoryEntity;

      beforeEach(async () => {
        categoryDto = categoryStub();
        category = await categoriesController.create(categoryDto);
      });

      test('then it should call create', () => {
        expect(categoriesService.create).toBeCalledWith(categoryDto);
      });

      test('then it should return a category', () => {
        expect(category).toEqual(categoryStub());
      });
    });
  });

  describe('update', () => {
    describe('when update is called', () => {
      let category: UpdateResult;
      let categoryDto: CategoryEntity;

      beforeEach(async () => {
        categoryDto = categoryStub();

        category = await categoriesController.update(
          categoryStub().id.toString(),
          categoryDto,
        );
      });

      test('then it should call update', () => {
        expect(categoriesService.update).toBeCalledWith(
          categoryStub().id,
          categoryDto,
        );
      });

      test('then it should return a category', () => {
        expect(category).toEqual(updateStub());
      });
    });
  });
});
