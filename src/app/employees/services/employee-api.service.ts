import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { Employee, Branch } from '../employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeApiService {
  private employeesUrl = 'https://api.entwicklung-gfi.de/api/dev/getmt';
  private branchesUrl = 'https://api.entwicklung-gfi.de/api/dev/getks ';

  constructor(
    private http: HttpClient
  ) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.employeesUrl);
  }
  
  getBranches(): Observable<Branch[]> {
    return this.http.get<Branch[]>(this.branchesUrl)
    .pipe(
      mergeMap((branches) => {
        return this.getEmployees().pipe(
          map((employees) => {
            return this.handleBranchEmployeeCombination(branches, employees);
          })
        )
      })
    );
  }

  private handleBranchEmployeeCombination(branches: Branch[], employees: Employee[]): Branch[] {
    employees.forEach((employee: Employee) => {
      const branch = branches.find(b => b.filialNr === employee.filialNr) || {} as Branch;
      branch.employees = [...branch.employees || [], employee]
    });

    return branches;
  }
}
