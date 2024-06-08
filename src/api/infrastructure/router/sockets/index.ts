import { Request, Response, Router } from 'express';

export const socketRouter = (): Router => {

    const socketRouter = Router();
    
    socketRouter.use('/location', ((req: Request, res: Response) => {
        res.send('Hola desde socket server');
    }));

    return socketRouter; // Agregar esta línea para devolver el enrutador
    
}
