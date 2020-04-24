import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '../_models';
import { UserService } from '../_services';
import { NgForm } from '@angular/forms';

@Component({ templateUrl: 'create-employee.component.html' })
export class CreateEmployee implements OnInit {
    currentUser: User;
    users: User[] = [];
    errorUserName: string;
    isSaved: boolean = false;
    //email:string="";
    phoneNumber: string = "";
    showPhoneErr: string = "";
    phoneNumberPattern = "/^[a-z0-9](?!.*?[^\na-z0-9]{2}).*?[a-z0-9]$/gmi";
    isValidFormSubmitted = false;
    userName: string = "";
    constructor(private userService: UserService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loadAllUsers();
        this.isSaved = false;
    }

    deleteUser(id: number) {
        this.userService.delete(id).pipe(first()).subscribe(() => {
            this.loadAllUsers()
        });
    }

    private loadAllUsers() {
        this.userService.getAll().pipe(first()).subscribe(users => {
            this.users = users;
        });
    }

    keyPress(event: any, whichValidation: string) {
        let pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (whichValidation === "Phone") {
            if (event.keyCode != 8 && !pattern.test(inputChar)) {
                event.preventDefault();
            }
        }
        else {
            pattern = /^[a-z0-9](?!.*?[^\na-z0-9]{2}).*?[a-z0-9]$/gmi
            if (event.keyCode !== 8 && !pattern.test(inputChar)) {
                this.errorUserName = "User Name can not be start with special characters"
            }
            this.validateUserName(inputChar);
        }
    }

    saveEmployee(employee: NgForm) {
        // this.isValidFormSubmitted = false;
        // if (employee.invalid) {
        //     return;
        // }
        // this.isValidFormSubmitted = true;
        this.setEmployeeToLocalStorage(employee.form.value);
        // this.getEmployeeToLocalStorage();
        employee.resetForm();
    }

    setEmployeeToLocalStorage(employeeData) {
        localStorage.setItem("employee", JSON.stringify(employeeData));
        this.isSaved = true;
    }
    getEmployeeToLocalStorage() {
        let empData = JSON.parse(localStorage.getItem("employee"));
        return empData;
    }

    validateUserName(inputChar) {
        if (inputChar === this.getEmployeeToLocalStorage()["userName"]) {
            return true;
        }
        else {
            return false;
        }
    }

}