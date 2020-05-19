import { DB } from './db';

export interface Storage {
  user: {
    token: string;
    expire: string;
    bu: DB.BasicUser;
  };
}

function saveStorage<K extends keyof Storage>(key: K, value: Storage[K]) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getStorage<K extends keyof Storage>(key: K) {
  const item = localStorage.getItem(key);
  return item ? (JSON.parse(item) as Storage[K]) : null;
}

function clearStorage() {
  localStorage.clear();
}
