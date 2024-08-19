import { SocketUser } from "../../domain/socket/socketEntity";
import { SocketsRepository } from "../../infrastructure/repository/sockets/SocketsRepository";

export class SocketUseCase {
    private users: SocketUser[];

    constructor() {
        this.users = [];
    }

    public async startAddUser(id: string, name: string): Promise<SocketUser[]> {
        const user: SocketUser = { id, name };
        this.users.push(user);
        return this.users;
    }

    // Método para obtener la lista de usuarios
    public async getUser(id:string): Promise<SocketUser> {
        let user = this.users.filter(i => i.id === id)[0]
        return user
    }

    public async getAllUsers(): Promise<SocketUser[]> {
        return this.users;
    }
    
    public async deleteUser(id: string): Promise<SocketUser> {
        let deleteOneUser = this.getUser(id)
        this.users = this.users.filter(user => user.id !== id);
        return deleteOneUser;
    }
}
