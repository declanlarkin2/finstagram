import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageService } from 'src/app/services/image.service';
import { AlertService } from 'src/app/services/alert.service';
import { decode } from 'jsonwebtoken';

@Component({
  selector: 'post-image',
  templateUrl: './postImage.component.html',
  styleUrls: ['./postImage.component.css'],
})
export class PostImageComponent implements OnInit {
  imageForm!: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;
  userDetails: any;
  @ViewChild('closebutton') closebutton: any;
  user_posts: any[];

  constructor(
    private formBuilder: FormBuilder,
    private imageService: ImageService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.imageForm = this.formBuilder.group({
      File: [null, Validators.required],
      caption: ['', Validators.required],
    });
    this.showAllImages();
  }

  showAllImages() {
    this.imageService.getImages().subscribe((images: any) => {
      this.user_posts = images.reverse();
    });
  }

  previewImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onSubmit() {
    if (this.imageForm.invalid) {
      return;
    }
    this.closebutton.nativeElement.click();

    const formData = new FormData();
    const fileInput = (
      document.getElementById('imageUpload') as HTMLInputElement
    ).files;

    if (fileInput && fileInput.length > 0) {
      formData.append('File', fileInput[0], fileInput[0].name);
      formData.append('fileName', fileInput[0].name);
    }

    const storedToken = JSON.parse(localStorage.getItem('token')!);

    if (storedToken !== null) {
      this.userDetails = decode(storedToken);
    }

    formData.append('username', this.userDetails.user);
    formData.append('userId', this.userDetails.user_id);
    formData.append('caption', this.imageForm.get('caption')!.value);
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
