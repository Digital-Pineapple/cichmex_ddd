import { Request, Response, NextFunction } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { SocketUseCase } from '../../../application/socket/socketUseCase';

export class SocketController extends ResponseData {
    private readonly socketUseCase: SocketUseCase;

    constructor(socketUseCase: SocketUseCase) {
        super();
        this.socketUseCase = socketUseCase;
        this.addUser = this.addUser.bind(this);
    }

    public async addUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id, name } = req.body;
            const response = await this.socketUseCase.startAddUser(id, name);
            this.invoke(response, 200, res, 'User added successfully', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al agregar el usuario', 500));
        }
    }
}
