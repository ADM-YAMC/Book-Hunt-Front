import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { UsersService } from '../../../shared/services/users.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilityService } from '../../../shared/services/utility.service';
import { CommonModule } from '@angular/common';
import { Role } from '../../../shared/models/Roles/roles';
import { RoleService } from '../../../shared/services/role.service';

@Component({
  selector: 'app-users-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './users-settings.component.html',
  styleUrl: './users-settings.component.css',
})
export class UsersSettingsComponent implements OnInit {
  form!: FormGroup;
  private formSubmitAttempt!: boolean;
  roleList: Role[] = [];

  constructor(
    public dialogRef: MatDialogRef<UsersSettingsComponent>,
    private changeDetecter: ChangeDetectorRef,
    private usersService: UsersService,
    private utility: UtilityService,
    private rolesServices: RoleService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;

    this.form = fb.group({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      password: [''],
      rpassword: [''],
      email: ['', [Validators.required, Validators.email]],
      roleId: [0, [Validators.required]],
      isActive: [''],
      changePassword: [false],
    });
  }
  ngOnInit(): void {
    this.getRole();
    this.addPasswordValidation();
    if (this.data.window !== 1) {
      if (this.data.window === 3) {
        this.form.controls['name'].disable();
        this.form.controls['lastName'].disable();
        this.form.controls['isActive'].disable();
        this.form.controls['roleId'].disable();
        this.form.controls['email'].disable();
      }
      this.removePasswordValidation();
      console.log(this.data);
      this.form.patchValue(this.data.user);
    }
  }
  addPasswordValidation(): void {
    const passwordControl = this.form.get('password');
    const rpasswordControl = this.form.get('rpassword');

    if (passwordControl && rpasswordControl) {
      passwordControl.setValidators([
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
        ),
      ]);

      rpasswordControl.setValidators([
        Validators.required,
        this.matchPassword('password'),
      ]);
      passwordControl.updateValueAndValidity();
      rpasswordControl.updateValueAndValidity();
    }
  }

  removePasswordValidation(): void {
    const passwordControl = this.form.get('password');
    const rpasswordControl = this.form.get('rpassword');

    if (passwordControl && rpasswordControl) {
      passwordControl.clearValidators();
      rpasswordControl.clearValidators();
      passwordControl.updateValueAndValidity();
      rpasswordControl.updateValueAndValidity();
    }
  }
  addOrRemove() {
    console.log(this.form.get('changePassword')?.value);
    if (!this.form.get('changePassword')?.value) {
      this.addPasswordValidation();
    } else {
      this.removePasswordValidation();
    }
  }
  matchPassword(passwordField: string) {
    return (control: AbstractControl) => {
      const password = control?.parent?.get(passwordField)?.value;
      const confirmPassword = control?.value;

      if (password !== confirmPassword) {
        return { passwordMismatch: true };
      }
      return null;
    };
  }

  getRole() {
    this.rolesServices.getAllRole().subscribe({
      next: (result) => {
        if (!result.thereIsError && result.successful) {
          this.roleList = result.dataList.length > 0 ? result.dataList : [];
        }
        // this.utility.alert(
        //   result.message,
        //   `${!result.thereIsError && result.successful ? 'success' : 'error'}`
        // );
      },
      error(err) {
        console.log();
      },
    });
  }
  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // console.log(this.form);
    // console.log(this.form.value);
    if (this.data.window === 1) {
      this.setUsers();
    } else {
      this.putUsers();
    }
  }

  setUsers() {
    this.formSubmitAttempt = true;
    var user = {
      ...this.form.value,
      roleId: parseInt(this.form.value.roleId),
    };
    this.usersService.setUsers(user).subscribe({
      next: (result) => {
        this.utility.alert(
          result.message,
          `${!result.thereIsError && result.successful ? 'success' : 'error'}`
        );
        if (!result.thereIsError && result.successful) {
          this.dialogRef.close(true);
        }
      },
      error(err) {
        console.log();
      },
    });
  }
  putUsers() {
    var user = {
      ...this.form.value,
      id: this.data.user.id,
      roleId: parseInt(this.form.value.roleId),
    };
    this.usersService.putUsers(user).subscribe({
      next: (result) => {
        this.utility.alert(
          result.message,
          `${!result.thereIsError && result.successful ? 'success' : 'error'}`
        );
        if (!result.thereIsError && result.successful) {
          this.dialogRef.close(true);
        }
      },
      error(err) {
        console.log();
      },
    });
  }
  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field)!.valid && this.form.get(field)!.touched) ||
      (this.form.get(field)!.untouched && this.formSubmitAttempt)
    );
  }
}
