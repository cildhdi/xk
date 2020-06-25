import { User, Term } from './db';

export interface Storage {
  user: User;
  term: Term;
}

export function saveStorage<K extends keyof Storage>(
  key: K,
  value: Storage[K],
) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getStorage<K extends keyof Storage>(key: K) {
  const item = localStorage.getItem(key);
  return item ? (JSON.parse(item) as Storage[K]) : null;
}

export function removeStorage<K extends keyof Storage>(key: K) {
  localStorage.removeItem(key);
}

export function clearStorage() {
  localStorage.clear();
}
