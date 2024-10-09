import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthorService } from '../../../shared/services/author.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtilityService } from '../../../shared/services/utility.service';

@Component({
  selector: 'app-autor-settings',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './autor-settings.component.html',
  styleUrl: './autor-settings.component.css',
})
export class AutorSettingsComponent implements OnInit {
  form!: FormGroup;
  private formSubmitAttempt!: boolean;
  constructor(
    public dialogRef: MatDialogRef<AutorSettingsComponent>,
    private changeDetecter: ChangeDetectorRef,
    private authorService: AuthorService,
    private utility: UtilityService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;

    this.form = fb.group({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      isActive: [''],
    });
  }
  ngOnInit(): void {
    if (this.data.window !== 1) {
      if (this.data.window === 3) {
        this.form.controls['name'].disable();
        this.form.controls['lastName'].disable();
        this.form.controls['isActive'].disable();
      }
      this.form.patchValue(this.data.data);
    }
  }
  save() {
    if (this.data.window === 1) {
      this.setAuthor();
    } else {
      this.putAuthor();
    }
  }

  setAuthor() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.formSubmitAttempt = true;

    this.authorService.setAuthor(this.form.value).subscribe({
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
  putAuthor() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    var author = {
      ...this.form.value,
      authorId: this.data.data.authorId,
    };

    this.formSubmitAttempt = true;
    this.authorService.putAuthor(author).subscribe({
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
