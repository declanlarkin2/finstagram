import { Injectable } from '@angular/core';
import axios, { AxiosRequestConfig } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private translateToFrench = new BehaviorSubject<boolean>(false);

  getButtonState(): boolean {
    return this.translateToFrench.getValue();
  }

  setButtonState(state: boolean): void {
    this.translateToFrench.next(state);
  }

  getTranslationObservable() {
    return this.translateToFrench.asObservable();
  }

  async translateText(text: string): Promise<string> {
    const key = environment.translationKey;
    const endpoint = 'https://api.cognitive.microsofttranslator.com';
    const location = 'uksouth';

    const config: AxiosRequestConfig = {
      baseURL: endpoint,
      url: '/translate',
      method: 'post',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Ocp-Apim-Subscription-Region': location,
        'Content-type': 'application/json',
        'X-ClientTraceId': uuidv4().toString(),
      },
      params: {
        'api-version': '3.0',
        from: 'en',
        to: 'fr',
      },
      data: [
        {
          Text: text,
        },
      ],
      responseType: 'json',
    };

    try {
      const response = await axios(config);
      return JSON.stringify(response.data[0]?.translations[0].text, null, 4);
    } catch (error) {
      console.error('Translation error:', error);
      return 'error'; // Handle error here or throw an exception
    }
  }
}
