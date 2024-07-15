import { DAOFactory } from '../factories/daoFactory.js';
import { UserDTO } from '../dto/userDTO.js';

export class UserRepository {
constructor() {
    this.userDAO = DAOFactory.getDAO('user');
}

async createUser(user) {
    const createdUser = await this.userDAO.create(user);
    return new UserDTO(createdUser);
}

async findUserByEmail(email) {
    const user = await this.userDAO.findByEmail(email);
    return user ? new UserDTO(user) : null;
}

async findUserById(id) {
    const user = await this.userDAO.findById(id);
    return user ? new UserDTO(user) : null;
    }
}
