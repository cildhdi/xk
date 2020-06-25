import { getStorage } from './storage';

export const isLoggedin = () => {
  let user = getStorage('user');
  if (!user) {
    return false;
  }
  return user;
};
