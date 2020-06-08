import { Filter } from './../../assets/Interfaces/Filter';
import { User } from './../../assets/Interfaces/User';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private baseUrl:string

  constructor(private http: HttpClient) { 
    this.baseUrl = 'http://localhost:3333';
  }
  create(user: User): Observable<User> {
      console.log(JSON.stringify(user));
      
      return this.http.post<User>(this.baseUrl+'/user',user);
  }

  getUsers(filter: Filter): Observable<User[]> {
    if(filter.birthday || filter.email || filter.name){ ;
      
      if(filter.birthday != '')
        filter.birthday = filter.birthday.toISOString();
      
      return this.http.get<User[]>(this.baseUrl+'/user',
      {
        headers:
        {
          filter:'true',
          name:filter.name,
          email:filter.email,
          birthday: filter.birthday
        }
      });
    } else {
      return this.http.get<User[]>(this.baseUrl+'/user')
    }   
  }
 
  deleteUser(id:string): Observable<any>{
    return this.http.delete(this.baseUrl+`/user/${id}`);
  }

  getUserById(id:string): Observable<User>{
    return this.http.get<User>(this.baseUrl+`/user/${id}`)
  }

  update(id:string,user:User):Observable<any>{
    return this.http.put(this.baseUrl+`/user/${id}`,user)
  }

  validate(id:string,password):Observable<any>{
    return this.http.get(this.baseUrl+`/user/validate/${id}`,{
      headers:
      {
        password:password
      }
    })
  }
}
