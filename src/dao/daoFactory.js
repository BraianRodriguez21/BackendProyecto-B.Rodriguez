import { UserDAO } from '../dao/userDAO.js';

export class DAOFactory {
  static getDAO(type) {
    switch (type) {
      case 'user':
        return new UserDAO();
      default:
        throw new Error('DAO type not supported');
    }
  }
}
