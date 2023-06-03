import { ResolveFn } from '@angular/router';
import { EmployeeApiService } from '../employees/services/employee-api.service';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Branch } from '../employees/employee';

export const branchesResolver: ResolveFn<Observable<Branch[]>> = () => {
  const service: EmployeeApiService = inject(EmployeeApiService);
  return service.getBranches();
};
