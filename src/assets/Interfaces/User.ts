export interface User{
    _id?: string,
    name:string,
    email:string,
    lastName:string,
    password?:string,
    birthday:any,
    createdAt?:any,
    hidden?:boolean
}