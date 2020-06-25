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
    item.id = Math.max(item.id ?? 0, maxID + 1);
    console.log(item);
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

export interface Course {
  id: number;
  academy_id?: number;
  credit?: number;
  hour?: number;
  name?: string;
}

export interface Opend {
  id: number;
  course_id?: number;
  user_id?: number;
  time?: string;
  classroom?: string;
  limit?: number;
}

export interface Elective {
  id: number;
  user_id?: number;
  course_id?: number;
  opend_id?: number;
  usual?: number;
  exam?: number;
  total?: number;
}

export const users = new Db<User>('xk_users');
export const academys = new Db<Academy>('xk_academys');
export const terms = new Db<Term>('xk_terms');
export const courses = new Db<Course>('xk_courses');
export const opends = new Db<Opend>('xk_opends');
export const electives = new Db<Elective>('xk_electives');

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
