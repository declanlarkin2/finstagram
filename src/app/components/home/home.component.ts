import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageService } from 'src/app/services/image.service';
import { AlertService } from 'src/app/services/alert.service';
import { decode } from 'jsonwebtoken';
import { Router } from '@angular/router';
import { TranslationService } from '../../services/translation.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  imageForm!: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;
  userDetails: any;
  @ViewChild('closebutton') closebutton: any;
  translate: boolean;
  translatedContentFr: any = {};
  userInfo: any;

  constructor(
    private formBuilder: FormBuilder,
    private imageService: ImageService,
    private alertService: AlertService,
    private router: Router,
    private translationService: TranslationService
  ) {}

  ngOnInit() {
    this.imageForm = this.formBuilder.group({
      File: [null, Validators.required],
      caption: ['', Validators.required],
    });
    this.translationService
      .getTranslationObservable()
      .subscribe(async (state) => {
        this.translate = state;
        this.translatedContentFr = await this.translatedContentMaker();
      });
  }

  translatedContent: any = {
    welcome: 'Welcome to Finstagram',
    place:
      "The place where you can share moments with your friends. Add captions, share photos, and explore your friends' feeds.",
    translateHint:
      'Finstagram has launched in both the UK and in France! To switch your laugage just click the translate button at the top of your screen!',
    postPhotos: 'Post your photos!',
    shareImage: 'Share Your Image',
    selectImage: 'Select Image:',
    captionLabel: 'Caption:',
    captionPlaceholder: 'Add a caption...',
    uploadButton: 'Upload Image',
  };

  async translatedContentMaker() {
    const translated: { [key: string]: string } = {};

    for (const key in this.translatedContent) {
      if (Object.prototype.hasOwnProperty.call(this.translatedContent, key)) {
        const value = this.translatedContent[key];
        const translatedValue = this.translate
          ? await this.translationService.translateText(value)
          : value;

        // Remove surrounding quotes from translatedValue, if present
        translated[key] = translatedValue.replace(/^"(.*)"$/, '$1');
      }
    }

    return translated;
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
    this.alertService.info('Uploading image...');
    this.imageService.addImage(formData).subscribe({
      next: () => {
        this.alertService.success('Image uploaded', {
          keepAfterRouteChange: true,
          autoClose: true,
        });
        this.imageService.notifyUser(
          this.userDetails.email,
          this.userDetails.user
        );
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.router.navigate(['/feed']);
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
