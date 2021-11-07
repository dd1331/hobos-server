// import { Test, TestingModule } from '@nestjs/testing';
// import { UsersService } from '../users.service';
// import { User } from '../entities/user.entity';
// import { HttpStatus } from '@nestjs/common';
// import { Repository } from 'typeorm';
// import { getRepositoryToken } from '@nestjs/typeorm';
// const newUsers = [
//   {
//     id: 0,
//     userId: 'test id',
//     userName: 'test',
//     password: '123123',
//     phone: '01000000000',
//   },
//   {
//     id: 1,
//     userId: 'test id 1',
//     userName: 'test1',
//     password: '123123',
//     phone: '01000000001',
//   },
//   {
//     id: 2,
//     userId: 'test id 2',
//     userName: 'test2',
//     password: '123123',
//     phone: '01000000002',
//   },
// ];
describe('UsersService', () => {
  it('', () => {
    return;
  });
  //   let service: UsersService;
  //   let repo: Repository<User>;
  //   // https://github.com/jmcdo29/testing-nestjs/tree/master/apps/typeorm-sample/src/cat
  //   beforeEach(async () => {
  //     const module: TestingModule = await Test.createTestingModule({
  //       providers: [
  //         UsersService,
  //         {
  //           provide: getRepositoryToken(User),

  //           useValue: {
  //             find: jest.fn().mockResolvedValue(newUsers),
  //             findOneOrFail: jest.fn().mockResolvedValue('oneCat'),
  //             create: jest.fn().mockReturnValue(newUsers[0]),
  //             save: jest.fn(),
  //             // as these do not actually use their return values in our sample
  //             // we just make sure that their resolee is true to not crash
  //             update: jest.fn().mockResolvedValue(true),
  //             // as these do not actually use their return values in our sample
  //             // we just make sure that their resolee is true to not crash
  //             delete: jest.fn().mockResolvedValue(true),
  //             // findOne: jest.fn().mockResolvedValue(true),
  //             findOne: jest.fn().mockReturnValue(newUsers[0]),
  //             softDelete: jest.fn(),
  //           },
  //         },
  //       ],
  //     }).compile();
  //     service = module.get<UsersService>(UsersService);
  //     repo = module.get<Repository<User>>(getRepositoryToken(User));
  //   });

  //   it('should be defined', () => {
  //     expect(service).toBeDefined();
  //   });
  //   it('should have findOne function', async () => {
  //     expect(typeof service.findOne).toBe('function');
  //   });
  //   it('should be called with id', async () => {
  //     await service.findOne(3);
  //     expect(repo.findOne).toHaveBeenCalledWith({
  //       where: { id: 3 },
  //     });
  //   });
  //   it('should throw error', async () => {
  //     (repo.findOne as jest.Mock).mockReturnValue(null);
  //     try {
  //       await service.findOne(-3);
  //     } catch (error) {
  //       expect(error.status).toBe(HttpStatus.NOT_FOUND);
  //       expect(error.message).toBe('user not found');
  //     }
  //     expect(repo.findOne).toHaveBeenCalled();
  //     expect(repo.findOne).toHaveBeenCalledWith({
  //       where: { id: -3 },
  //     });
  //   });
  //   test('findOne function should be defined', async () => {
  //     expect(typeof service.findOne).toBe('function');
  //     await service.findOne(3);
  //     expect(repo.findOne).toHaveBeenCalledWith({
  //       where: { id: 3 },
  //     });
  //   });

  //   describe('create', () => {
  //     it('should have create function', () => {
  //       expect(service.create).toBeDefined();
  //       expect(typeof service.create).toBe('function');
  //     });

  //     it('should be called with newUserPayload', async () => {
  //       (repo.findOne as jest.Mock).mockReturnValue(null);
  //       await service.create(newUsers[0]);
  //       expect(repo.create).toHaveBeenCalledWith(newUsers[0]);
  //     });
  //     it('should return true if newUserPayload is created', async () => {
  //       (repo.findOne as jest.Mock).mockReturnValue(null);
  //       (repo.create as jest.Mock).mockReturnValue(newUsers[0]);
  //       const response = await service.create(newUsers[0]);
  //       expect(response).toStrictEqual(newUsers[0]);
  //     });
  //     it('should throw an error if phone exist', async () => {
  //       (repo.create as jest.Mock).mockReturnValue(new Error());
  //       const { phone, userId, userName } = newUsers[0];
  //       try {
  //         await service.create(newUsers[0]);
  //       } catch (error) {
  //         console.log(error);
  //         expect(error.status).toBe(HttpStatus.CONFLICT);
  //         expect(error.message).toBe('이미 존재하는 **입니다');
  //       }
  //       expect(repo.findOne).toBeCalled();
  //       expect(repo.findOne).toHaveBeenCalledWith({
  //         where: [{ phone }, { userId }, { userName }],
  //       });
  //     });
  //     it('should return an error if phone exist', async () => {
  //       (repo.findOne as jest.Mock).mockReturnValue(newUsers[0]);
  //       try {
  //         await service.checkIfExist(newUsers[0]);
  //       } catch (error) {
  //         expect(error.status).toEqual(HttpStatus.CONFLICT);
  //         expect(error.message).toEqual('이미 존재하는 **입니다');
  //       }
  //     });
  //     it('should return true if name does not exist', async () => {
  //       (repo.findOne as jest.Mock).mockReturnValue(null);
  //       const response = await service.checkIfExist(newUsers[0]);
  //       expect(response).toBeTruthy;
  //     });
  //     it('should return true if phone does not exist', async () => {
  //       (repo.findOne as jest.Mock).mockReturnValue(null);
  //       const response = await service.checkIfExist(newUsers[0]);
  //       expect(response).toBeTruthy;
  //     });
  //   });

  //   describe('read', () => {
  //     it('findOne function should be defined', async () => {
  //       expect(service.findOne).toBeDefined;
  //       expect(typeof service.findOne).toBe('function');
  //     });
  //     it('findOne should be called with int', async () => {
  //       const id = 5;
  //       await service.findOne(id);
  //       expect(repo.findOne).toHaveBeenCalledWith({
  //         where: { id },
  //       });
  //     });
  //     it('should throw an error when user does not exist', async () => {
  //       (repo.findOne as jest.Mock).mockReturnValue(null);
  //       try {
  //         await service.findOne(-5);
  //       } catch (error) {
  //         expect(error.status).toBe(HttpStatus.NOT_FOUND);
  //         expect(error.message).toBe('user not found');
  //       }
  //       expect(repo.findOne).toHaveBeenCalled();
  //       expect(repo.findOne).toHaveBeenCalledWith({
  //         where: { id: -5 },
  //       });
  //       // const { response } = await service.findOne(-5);
  //     });
  //     it('should return a user if user exists', async () => {
  //       const response = await service.findOne(3);
  //       expect(response).toStrictEqual(newUsers[0]);
  //     });

  //     it('should return all users', async () => {
  //       const res = await service.findAll();
  //       expect(res).toStrictEqual(newUsers);
  //     });
  //   });
  //   describe('DELETE', () => {
  //     it('return false if user does not exist', async () => {
  //       (repo.findOne as jest.Mock).mockReturnValue(null);
  //       try {
  //         await service.remove(-3);
  //       } catch (error) {
  //         expect(error.status).toBe(HttpStatus.NOT_FOUND);
  //         expect(error.message).toBe('user not found');
  //       }
  //       expect(repo.findOne).toBeCalled();
  //       expect(repo.findOne).toHaveBeenCalledWith(-3);
  //     });
  //     it('softdelete and return true if user exist', async () => {
  //       (repo.findOne as jest.Mock).mockReturnValue(newUsers[0]);
  //       (repo.softDelete as jest.Mock).mockReturnValue(newUsers[0]);
  //       const response = await service.remove(0);
  //       expect(response).toBeTruthy;
  //     });
  //   });
});
