export namespace DB {
  interface Model {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt?: string;
  }

  export interface Academy extends Model {
    Name: string;
    Addr: string;
    Phone: string;
  }

  export type UserRole = BasicUser['Role'];

  export const roleName: { [key in UserRole]: string } = {
    a: '管理员',
    s: '学生',
    t: '教师',
  };

  export interface BasicUser extends Model {
    Username: string;
    Secret?: string;
    Role: 'a' | 's' | 't';
    Name?: string;
    Sex?: string;
    Birthday?: string;
    Birthplace?: string;
  }

  export interface Student extends Model {
    BasicUserID: number;
    AcademyID: number;
  }

  export interface Teacher extends Model {
    BasicUserID: number;
    AcademyID: number;
    Level: string;
    Salary: number;
  }
}
