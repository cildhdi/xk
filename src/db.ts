export interface Academy {
  id: number;
  name?: string;
  addr?: string;
  phone?: string;
}

export interface User {
  id: number;
  username?: string;
  secret?: string;
  role?: '管理员' | '学生' | '教师';
  academy_id?: number;
  name?: string;
  sex?: '男' | '女';
  birthday?: string;
  birthplace?: string;
}

export interface Term {
  id: number;
  name: string;
}

class Db<T extends { id: number }> {
  storageKey = 'storageKey';

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  getItems = () => {
    let raw = localStorage.getItem(this.storageKey);
    let items: T[] = [];
    if (raw) {
      items = JSON.parse(raw);
    }
    return items;
  };

  setItems = (items: T[]) => {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  };

  insert = (item: T) => {
    let items = this.getItems();
    let maxID = 1;
    for (const i of items) {
      maxID = Math.max(i.id, maxID);
    }
    item.id = Math.max(item.id, maxID + 1);
    items.push(item);
    this.setItems(items);
  };

  query = (conds: Partial<T>) => {
    return this.getItems().filter(item => {
      for (const key in conds) {
        if (conds[key] !== item[key]) {
          return;
        }
      }
      return item;
    });
  };

  update = (item: T) => {
    let items = this.getItems();
    for (let index = 0; index < items.length; index++) {
      if (items[index].id == item.id) {
        items[index] = item;
      }
    }
    this.setItems(items);
  };
}

export const users = new Db<User>('xk_users');
export const academys = new Db<Academy>('xk_academys');
export const terms = new Db<Term>('xk_terms');

if (users.query({ role: '管理员' }).length === 0) {
  users.insert({
    id: 1,
    username: '17122990',
    secret: '17122990',
    role: '管理员',
    name: '杨磊',
    sex: '男',
    birthday: '1999-08-19',
    birthplace: '湖北',
  });
}
