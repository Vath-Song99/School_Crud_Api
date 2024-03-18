export interface User {
  parse(body: any): unknown;
  username: string;
  age: string;
}

