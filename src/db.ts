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

  export interface BasicUser extends Model {
    Username: string;
    Secret: string;
    Role: string;
    Name: string;
    Sex: string;
    Birthday: string;
    Birthplace: string;
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
