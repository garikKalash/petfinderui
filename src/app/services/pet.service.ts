import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Animal} from '../models/animal.model';
import {environment} from '../../environments/environment.prod';
import {Organization} from '../models/organization.model';

@Injectable()
export class PetService {
  constructor(private httpClient: HttpClient) {
  }

  search(type: string, breed: string[], gender: string[], coat: string[],
         color: string[], location: string, organizations: Organization[],
         statuses: string[]): Observable<Animal[]> {
    console.log(organizations);
    console.log(statuses);
    console.log(location);
    const param: any = {};
    if (type) {
      param.type = type;
    }
    if (location) {
      param.location = location;
    }
    if (breed && breed.length !== 0) {
       param.breed = breed;
     }
    if (statuses && statuses.length !== 0) {
       param.status = statuses;
     }
    if (organizations && organizations.length !== 0) {
       const ids = organizations.map((x) => {
         return x.orgId;
       });
       param.organization = ids;
     }
    if (gender && gender.length !== 0) {
       param.gender = gender;
     }
    if (coat && coat.length !== 0) {
       param.coat = coat;
     }
    if (color && color.length !== 0) {
       param.color = color;
     }
    return this.httpClient.get<Animal[]>(`${environment.apiUrl}/api/v1/pf/animals/search`, {params: param});
  }
}
