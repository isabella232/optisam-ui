// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { GroupService } from './../../../../core/services/group.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, FormGroupDirective, NgForm, NgModel } from '@angular/forms';
import { MatDialog } from '@angular/material';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  hide1 = true;
  hide2 = true;
  groupForm: FormGroup;
  matchPassword: Boolean = false;


  constructor(private groupService: GroupService, 
              public router: Router,
              private dialog:MatDialog) { }

  ngOnInit() {
    this.groupForm = new FormGroup({
      'old': new FormControl('', [Validators.required]),
      'new': new FormControl('', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{7,}')]),
      'confirm': new FormControl('', [Validators.required]),
    });
  }

  get old() {
    return this.groupForm.get('old');
  }

  get new() {
    return this.groupForm.get('new');
  }
  get confirm() {
    return this.groupForm.get('confirm');
  }
  createGroup(successMsg, errorMsg) {
    const data = this.groupForm.value;
    if (data.new === data.confirm) {
      this.matchPassword = false;
      delete data.confirm;
      this.groupService.changePassword(data).subscribe(res => {
        this.groupForm.reset();
        localStorage.clear();
        this.router.navigate(['/']);

        this.openModal(successMsg);
      },
      (error) => {
        this.openModal(errorMsg);
      });
      } 
      else {
        this.matchPassword = true;
    }
  }

  openModal(templateRef) {
    let dialogRef = this.dialog.open(templateRef, {
        width: '50%',
        disableClose: true
    });
  }
}
