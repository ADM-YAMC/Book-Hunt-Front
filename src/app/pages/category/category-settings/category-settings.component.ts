import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category } from '../../../shared/models/Category/category';
import { CategoryService } from '../../../shared/services/category.service';
import { CommonModule } from '@angular/common';
import { UtilityService } from '../../../shared/services/utility.service';

@Component({
  selector: 'app-category-settings',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './category-settings.component.html',
  styleUrl: './category-settings.component.css',
})
export class CategorySettingsComponent implements OnInit {
  form!: FormGroup;
  private formSubmitAttempt!: boolean;
  constructor(
    public dialogRef: MatDialogRef<CategorySettingsComponent>,
    private changeDetecter: ChangeDetectorRef,
    private categoryService: CategoryService,
    private utility: UtilityService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;

    this.form = fb.group({
      name: ['', [Validators.required]],
      isActive: [''],
    });
  }
  ngOnInit(): void {
    if (this.data.window !== 1) {
      if (this.data.window === 3) {
        this.form.controls['name'].disable();
        this.form.controls['isActive'].disable();
      }
      this.form.patchValue(this.data.data);
    }
  }
  save() {
    if (this.data.window === 1) {
      this.setCategory();
    } else {
      this.putCategory();
    }
  }

  setCategory() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.formSubmitAttempt = true;

    this.categoryService.setCategory(this.form.value).subscribe({
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
  putCategory() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    var category = {
      ...this.form.value,
      categoryId: this.data.data.categoryId,
    };

    this.formSubmitAttempt = true;
    this.categoryService.putCategory(category).subscribe({
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
