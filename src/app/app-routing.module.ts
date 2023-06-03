import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { branchesResolver } from './resolvers/branches.resolver';
import { employeesResolver } from './resolvers/employees.resolver';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./employees/employees.module').then(m => m.EmployeesModule),
    resolve: {
      branches: branchesResolver,
      employees: employeesResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
