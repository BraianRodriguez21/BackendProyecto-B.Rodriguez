import { UserDAO } from '../dao/userDao.js';

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
