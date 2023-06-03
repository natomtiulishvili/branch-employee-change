import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Branch, Employee } from '../employee';
import { EmployeeService } from '../services/employee.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent implements OnInit {
  @Output() handleEmployeeChange = new EventEmitter<{employee: Employee, filialeNr: number}>();

  employee!: Employee;
  form!: FormGroup;
  branches: Branch[] = [];
  originalBranches: Branch[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private _employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.pipe(
      untilDestroyed(this)
    ).subscribe(({ branches }) => {
      this.branches = this.originalBranches = branches;
    });
    this.handleSelectedEmployeeSubscription();
  }

  private handleSelectedEmployeeSubscription(): void {
    this._employeeService.selectedEmployee$.pipe(
      untilDestroyed(this)
    ).subscribe((employee: Employee) => {
      this.employee = employee;
      this.initForm(this.employee);
      this.handleBranchControlValueChanges();
    });
  }

  private initForm(employee: Employee): void {
    this.form = this.formBuilder.group({
      name: [employee?.name || '', Validators.required],
      vorname: [employee?.vorname || '', Validators.required],
      filiale: [employee?.filiale || {}, Validators.required]
    });
  }

  private handleBranchControlValueChanges(): void {
    this.form.get('filiale')?.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe((control) => {
      if (typeof control === 'string') this.branches = this.originalBranches.filter(b => (b.ansichtName).toLowerCase().includes(control.toLowerCase()));
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.employee.name = this.form.value.name || '';
      this.employee.vorname = this.form.value.vorname || '';
      let newFilialeNr = 0;
      if (this.form.value.filiale.filialNr !== this.employee.filialNr) {
        newFilialeNr = this.form.value.filiale.filialNr;
      }
      this.handleEmployeeChange.emit({
        employee: this.employee,
        filialeNr: newFilialeNr
      });
    }
  }

  displayBranchNames(branch: Branch): string {
    if (!branch) return '';
    return branch.ansichtName || '';
  }
}
