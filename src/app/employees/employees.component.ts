import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Employee, Branch } from './employee';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from './services/employee.service';

@UntilDestroy()
@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent implements OnInit {
  originalEmployees: Employee[] = [];
  employees: Employee[] = [];
  originalBranches:  Branch[] = [];
  branches:  Branch[] = [];
  selectedEmployee: Employee = {} as Employee;
  selectedBranchNumber = -1;

  searchEmployeesControl = new FormControl();

  constructor(
    private activatedRoute: ActivatedRoute,
    private _employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.handleDataInit();
    this.handleSearchControlValueChanges();
  }

  private handleDataInit(): void {
    this.activatedRoute.data.subscribe(({ branches, employees }) => {
      this.branches = this.originalBranches = branches;
      this.employees = this.originalEmployees = employees
    });
  }

  private handleSearchControlValueChanges() {
    this.searchEmployeesControl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe((control) => {
      if (typeof control === 'string') {
        this.employees = this.originalEmployees.filter(e => (`${e.name} ${e.vorname}`).toLowerCase().includes(control.toLowerCase()));
      }
    });
  }

  handleEmployeeSearchChange(employee: Employee): void {
    this.selectedBranchNumber = employee.filialNr;
    this.setSelectedEmployee(employee);
  }

  setSelectedEmployee(employee: Employee) {
    this.selectedEmployee = employee;
    this._employeeService.selectedEmployee$.next(this.selectedEmployee);
  }

  handleFilialeChange(newFilialNr: number): void {
    const oldFiliale = this.originalBranches.find(b => b.filialNr === this.selectedEmployee?.filialNr);
    const newFiliale = this.originalBranches.find(b => b.filialNr === newFilialNr);
    if (oldFiliale) {
      oldFiliale.employees = oldFiliale.employees?.filter(e => e.id !== this.selectedEmployee?.id);
    }
    if (newFiliale) {
      this.selectedEmployee.filialNr = newFiliale.filialNr;
      this.selectedEmployee.filiale = structuredClone(newFiliale);
      delete this.selectedEmployee.filiale.employees;
      newFiliale.employees = [...newFiliale.employees || [], this.selectedEmployee];
    }
    this.selectedBranchNumber = newFilialNr;
  }

  displayEmployeesNamesInSearchField(employee: Employee): string {
    if (!employee) return '';
    return (employee?.name || '') + ' ' + (employee?.vorname || '');
  }
}

