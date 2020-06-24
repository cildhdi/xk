import { isLoggedin } from './util';
import { history } from 'umi';
import { DB } from './db';
import md5 from 'blueimp-md5';

const server = 'https://xk.ketra.fun:444/api';

export enum ResponseCode {
  Ok,
  ParamError,
  DatabaseError,
  Unauthorized,
}

export const codeMessage = {
  [ResponseCode.Ok]: '操作成功',
  [ResponseCode.ParamError]: '参数错误',
  [ResponseCode.DatabaseError]: '数据库错误',
  [ResponseCode.Unauthorized]: '未登录或权限不够',
};

interface XkResponse<T> {
  code: ResponseCode;
  msg: string;
  data: T;
}

type RemovePromise<T extends Promise<any>> = T extends Promise<infer R>
  ? R
  : any;
type RemoveResponse<T extends XkResponse<any>> = T extends XkResponse<infer R>
  ? R
  : any;
export type APIResponse<T extends keyof API> = RemovePromise<
  ReturnType<API[T]>
>;
export type ResponseData<T extends keyof API> = RemoveResponse<
  RemovePromise<ReturnType<API[T]>>
>;
export type APIRequest<T extends keyof API> = Parameters<API[T]>;

export class API {
  request = async <T>(
    url: string,
    init?: RequestInit,
  ): Promise<XkResponse<T>> => {
    let headers: RequestInit['headers'] = {};
    url = url.trimEnd();
    if (url.endsWith(']')) {
      let user = isLoggedin();
      if (user) {
        headers = {
          Authorization: `Bearer ${user.token}`,
        };
      } else {
        history.push('/login');
      }
    }
    if (!init) {
      init = { headers };
    } else {
      init.headers = {
        ...init.headers,
        ...headers,
      };
    }
    let res = await fetch(server + url, {
      ...init,
      mode: 'cors',
    });
    if (res.ok) {
      return (await res.json()) as XkResponse<T>;
    } else {
      throw new Error(res.statusText);
    }
  };

  post = async <T>(url: string, body?: Object) =>
    this.request<T>(url, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });

  get = async <T>(url: string) => this.request<T>(url, { method: 'GET' });

  login = async (data: { username: string; password: string }) => {
    return this.post<{
      token: string;
      expire: string;
      bu: DB.BasicUser;
    }>('/login', {
      username: data.username,
      secret: md5(data.password),
    });
  };

  status = async () => {
    return this.get<any>('/status[sat]');
  };
}

export const api = new API();
