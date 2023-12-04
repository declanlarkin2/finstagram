import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageService } from 'src/app/services/image.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  imageForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private imageService: ImageService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.imageForm = this.formBuilder.group({
      File: [null, Validators.required],
      fileName: ['', Validators.required],
      username: ['', Validators.required],
      userId: ['', Validators.required],
      caption: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.imageForm.invalid) {
      return;
    }

    const formData = new FormData();
    const fileInput = (
      document.getElementById('imageUpload') as HTMLInputElement
    ).files;

    if (fileInput && fileInput.length > 0) {
      formData.append('File', fileInput[0], fileInput[0].name);
    }

    formData.append('fileName', this.imageForm.get('fileName')!.value);
    formData.append('username', this.imageForm.get('username')!.value);
    formData.append('userId', this.imageForm.get('userId')!.value);
    formData.append('caption', this.imageForm.get('caption')!.value);
    console.log(formData);
    this.uploadImage(formData);
  }

  uploadImage(formData: FormData) {
    this.imageService.addImage(formData).subscribe({
      next: () => {
        this.alertService.success('Image uploaded', {
          keepAfterRouteChange: false,
          autoClose: true,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (error) => {
        this.handleError(error);
      },
    });
  }

  private handleError(error: any) {
    this.alertService.error(error, { autoClose: true });
    this.scrollToTop();
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
