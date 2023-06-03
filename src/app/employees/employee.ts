export interface Employee {
  id: number;
  ansichtNam: string;
  name: string;
  vorname: string;
  status: string;
  notActive: number;
  qualifikation: string;
  filialNr: number;
  filiale: Branch;
  land: string;
  bundesLand: string;
  istAdmin: boolean;
  istPlan: boolean;
  geburtsDatum: string;
  eintritsDatum: string;
  barcode: number;
  barcode1: number;
  passwort: string;
  adkran: number;
  kaplan: number;
}

export interface Branch {
  filialNr: number;
  ansichtName: string;
  bundesLand: string;
  land: string;
  employees?: Employee[];
}