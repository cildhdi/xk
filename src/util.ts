import { getStorage } from './storage';

export const isLoggedin = () => {
  let user = getStorage('user');
  if (!user) {
    return false;
  }
  if (user.expire && Date.parse(user.expire) > Date.now() && user.token) {
    return user;
  }
  return false;
};
