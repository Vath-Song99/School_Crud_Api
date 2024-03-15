export interface User {
  username: string;
  age: string;
}

export interface App {
    
    get: (arg0: string, arg1: (req:Request,res:Response) => void) => void;
    post: (arg0: string, arg1: (req:Request,res:Response) => void) => void;
    patch: (arg0: string, arg1: (req:Request,res:Response) => void) => void;
    delete: (arg0: string, arg1: (req:Request,res:Response) => void) => void;
   
}

export interface UserSchema {
  find(): unknown;
  findById(id: string): unknown;
  findByIdAndUpdate(id: string, data: User): unknown;
  deleteOne(arg0: { _id: string; }): unknown;
    
}