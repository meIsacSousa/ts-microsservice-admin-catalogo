import { CategoriesController } from './categories.controller';
import { SortDirection } from '@fc/micro-videos/@seedwork/domain';

describe('CategoryController Unit Tests', () => {
  let controller: CategoriesController;

  beforeEach(() => {
    controller = new CategoriesController();
  });

  it('should create a category', async () => {
    const expectedOutput = {
      id: '9966b7a0-0b9a-4b3b-8c9a-2c8597c42f3c',
      name: 'Category',
      description: 'Category Description',
      is_active: true,
    };
    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };
    controller['createUseCase'] = mockCreateUseCase as any;
    const input = {
      name: 'Category',
      description: 'Category Description',
      is_active: true,
    };
    const output = await controller.create(input);
    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(expectedOutput).toStrictEqual(output);
  });

  it('should update a category', async () => {
    const id = '9966b7a0-0b9a-4b3b-8c9a-2c8597c42f3c';
    const expectedOutput = {
      id,
      name: 'Updated Category',
      description: 'Category Description',
      is_active: true,
    };
    const mockUpdateseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };
    controller['updateUseCase'] = mockUpdateseCase as any;
    const input = {
      name: 'Updated Category',
      description: 'Category Description',
      is_active: true,
    };
    const output = await controller.update(id, input);
    expect(mockUpdateseCase.execute).toHaveBeenCalledWith({ id, ...input });
    expect(expectedOutput).toStrictEqual(output);
  });

  it('should delete a category', async () => {
    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(undefined)),
    };
    controller['deleteUseCase'] = mockDeleteUseCase as any;
    const id = '9966b7a0-0b9a-4b3b-8c9a-2c8597c42f3c';
    expect(controller.remove(id)).toBeInstanceOf(Promise);
    await controller.remove(id);
    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id });
  });

  it('should return a category', async () => {
    const id = '9966b7a0-0b9a-4b3b-8c9a-2c8597c42f3c';
    const expectedOutput = {
      id,
      name: 'Category',
      description: 'Category Description',
      is_active: true,
    };
    const mockGetUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };
    controller['getUseCase'] = mockGetUseCase as any;
    const output = await controller.findOne(id);
    expect(mockGetUseCase.execute).toHaveBeenCalledWith({ id });
    expect(expectedOutput).toStrictEqual(output);
  });

  it('should return a list of categories', async () => {
    const expectedOutput = {
      items: [
        {
          id: '9966b7a0-0b9a-4b3b-8c9a-2c8597c42f3c',
          name: 'Category',
          description: 'Category Description',
          is_active: true,
        },
      ],
      current_page: 1,
      total_pages: 1,
      per_page: 1,
      total: 1,
    };
    const mockListUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };
    const searchParam = {
      page: 1,
      per_page: 1,
      sort: 'name',
      sort_dir: 'ASC' as SortDirection,
      filter: 'test',
    };
    controller['listUseCase'] = mockListUseCase as any;
    const output = await controller.search(searchParam);
    expect(mockListUseCase.execute).toHaveBeenCalledWith(searchParam);
    expect(expectedOutput).toStrictEqual(output);
  });
});
