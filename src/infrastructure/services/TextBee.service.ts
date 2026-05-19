import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TextBeeService {
  private readonly API_KEY = '2b589255-264d-41d1-a5c7-a91a4e284cf3';
  private readonly DEVICE_ID = '69e2cdc6b5cd3ce4c7acc885';
  private readonly apiUrl = `https://api.textbee.dev/api/v1/gateway/devices/${this.DEVICE_ID}/send-sms`;

  private normalizePhone(phone: string): string {
    if (!phone) return phone;

    let p = phone.trim().replace(/[^\d+]/g, '');

    if (!p.startsWith('+')) {
      p = '+' + p;
    }

    return p;
  }

  async sendOtp(phoneNumber: string, code: string): Promise<boolean> {
    try {
      const phone = this.normalizePhone(phoneNumber);

      console.log('📱 NORMALIZED PHONE:', phone);

      const message = `Your password reset code: ${code}. Valid for 15 minutes.`;

      const response = await axios.post(
        this.apiUrl,
        {
          device_id: this.DEVICE_ID,
          recipients: [phoneNumber],
          message,
        },
        {
          headers: {
            'x-api-key': this.API_KEY,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('📨 TextBee response:', response.data);

      // более гибкая проверка
      if (response.status >= 200 && response.status < 300) {
        return true;
      }

      throw new Error('Unexpected response from SMS provider');
    } catch (error: any) {
      console.error('❌ TextBee error response:', error.response?.data);
      console.error('❌ TextBee full error:', error.message);

      throw new HttpException(
        error.response?.data?.error || 'Failed to send SMS notification',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
