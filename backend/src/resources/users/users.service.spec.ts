import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { mockUser } from './mocks/user.mock';

describe('UsersService', () => {
  let service: UsersService;
  let repo: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should save a new user', async () => {
      repo.save.mockResolvedValue(mockUser);

      const result = await service.create({
        username: 'testuser',
        password: '123',
      });

      expect(repo.save).toHaveBeenCalledWith({
        username: 'testuser',
        password: '123',
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findOne', () => {
    it('should find a user by id', async () => {
      repo.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findOneByUsername', () => {
    it('should find a user by username', async () => {
      repo.findOne.mockResolvedValue(mockUser);

      const result = await service.findOneByUsername('testuser');

      expect(repo.findOne).toHaveBeenCalledWith({
        where: { username: 'testuser' },
        select: ['id', 'username', 'password'],
      });
      expect(result).toEqual(mockUser);
    });
  });
});
