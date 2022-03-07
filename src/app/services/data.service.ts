import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment.prod';
import {Type} from '../models/type.model';
import {Organization} from '../models/organization.model';

@Injectable()
export class DataService {
  constructor(private httpClient: HttpClient) {

  }

  types(): Observable<Type[]> {
    return this.httpClient.get<Type[]>(`${environment.apiUrl}/api/v1/pf/data/types`);
  }

  organizations(): Observable<Organization[]> {
    return this.httpClient.get<Organization[]>(`${environment.apiUrl}/api/v1/pf/data/organizations`);
  }

}
