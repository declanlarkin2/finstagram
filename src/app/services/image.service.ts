import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ImageService {
  constructor(private http: HttpClient) {}

  getImages() {
    return this.http.get(
      'https://prod-11.uksouth.logic.azure.com:443/workflows/87dc49755609454f9c13627f0eb488a2/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=GuwWxoMVEu0zekNXX0sqln2wZc3EuY3EUFM6iN8cEbg'
    );
  }

  addImage(formData: any) {
    return this.http.post(
      'https://prod-43.eastus.logic.azure.com:443/workflows/dc723f37961c479798a309a3289e3b54/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ipu6es6nimm0y8AbTiZxmVuc-niyd_-5IBGaeAuJpao',
      formData
    );
  }
}
