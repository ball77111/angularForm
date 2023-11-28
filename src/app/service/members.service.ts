import { Injectable } from '@angular/core';
import { Observable, map, lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


export type MemberType = {
  Name:string,
  DateOfBirth:string,
  Salary:number,
  Address:string
}

export type ApiResponse = {
Success: boolean,
Msg: string | null,
Data: MemberType[]
};

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  constructor(private http: HttpClient) { }

  private apiUrl = environment.apiUrl + '/api';

  //取得成員員工資料
  async getMember(): Promise<MemberType[]>  {
    const response = await lastValueFrom(this.http.get<ApiResponse>(`${this.apiUrl}/Record/GetRecords`).pipe(
      map(response => response)
    ));

    return response.Data
  }

  // 修改員工資料
  async editMember(data:MemberType[])  {
    return await lastValueFrom(this.http.post(`${this.apiUrl}/Record/SaveRecords`,data).pipe(
      map(response => response)
    ));
  }

}
