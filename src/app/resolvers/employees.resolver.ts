import { ResolveFn } from '@angular/router';
import { EmployeeApiService } from '../employees/services/employee-api.service';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../employees/employee';

export const employeesResolver: ResolveFn<Observable<Employee[]>> = () => {
  const service: EmployeeApiService = inject(EmployeeApiService);
  return service.getEmployees();
};
