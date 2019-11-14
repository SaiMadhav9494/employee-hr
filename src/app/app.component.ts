import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  HttpErrorResponse, HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { ServerResponse } from './models/serverResponse.model';
import { Employee } from './models/employee.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  employees: Array<Employee> = [];
  form: FormGroup;
  serverAddress = 'http://localhost:8080';

  constructor(private formBuilder: FormBuilder, 
    private http: HttpClient) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      fullName: ['', Validators.required],
      role: ['', Validators.required],
      grossPay: [null, Validators.required],
      forZeroOneK: [null],
      insurance: [null]
    });

    this.http.get<ServerResponse>(`${ this.serverAddress }/employees`).pipe(catchError(this.handleError), shareReplay())
    .subscribe((response: ServerResponse) => {
      console.log(response);
      this.employees = response.data;
    }, error => {
      console.log(error);
      alert('Something has gone wrong');
    });
  }

  get inputForm() {
    return this.form.controls;
  }

  onSubmit() {
    console.log('Data submitted', this.inputForm);
    if (this.form.invalid) {
      alert('Please fill out the form properly');
      return;
    }

    const deductions = [];
    let takeHomePay = this.inputForm.grossPay.value - (this.inputForm.grossPay.value * (17/100));

    if(this.inputForm.insurance.value) {
      deductions.push('Medical insurance');
      takeHomePay -= takeHomePay * 10/100;
    }

    if(this.inputForm.forZeroOneK.value) {
      deductions.push('401k');
    }

    console.log(deductions, takeHomePay);
    const employee = {
      fullName: this.inputForm.fullName.value,
      role: this.inputForm.role.value,
      grossPay: this.inputForm.grossPay.value,
      deductions,
      takeHomePay: Math.round(takeHomePay)
    };

    this.http.post<ServerResponse>(`${ this.serverAddress }/employees`, employee)
    .pipe(catchError(this.handleError), shareReplay())
    .subscribe((response: ServerResponse) => {
      console.log(response);
      this.employees.push(employee);
    }, error => {
      console.log(error);
      alert('Something has gone wrong');
    });
  }

  // Error handler for the http requests.
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      return throwError({
        error: 'client_side_error',
        data: null,
      });
    } else if (error.error instanceof ProgressEvent) {
      return throwError(
        { error: 'client_or_server_failure', data: null });
    } else {
      return throwError(error.error);
    }
  }
}
