import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class ThumbnailService {
  async getThumbnail(url: string): Promise<string | null> {
    try {
      if (this.isYoutube(url)) {
        const videoId = this.extractYoutubeId(url);
        if (videoId) {
          return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }
      }

      const thumbnail = await this.getMicrolinkImage(url);
      if (thumbnail) return thumbnail;

      const ogImage = await this.getOgImage(url);
      return ogImage;
    } catch {
      return null;
    }
  }

  private async getMicrolinkImage(url: string): Promise<string | null> {
    try {
      const { data } = await axios.get('https://api.microlink.io', {
        params: { url },
        timeout: 8000,
      });

      return data?.data?.image?.url ?? data?.data?.screenshot?.url ?? null;
    } catch {
      return null;
    }
  }

  private async getOgImage(url: string): Promise<string | null> {
    try {
      const { data } = await axios.get(url, {
        timeout: 5000,
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });
      const $ = cheerio.load(data);
      return (
        $('meta[property="og:image"]').attr('content') ||
        $('meta[name="twitter:image"]').attr('content') ||
        null
      );
    } catch {
      return null;
    }
  }

  private isYoutube(url: string): boolean {
    return url.includes('youtube.com') || url.includes('youtu.be');
  }

  private extractYoutubeId(url: string): string | null {
    const patterns = [
      /youtube\.com\/watch\?v=([^&]+)/,
      /youtu\.be\/([^?]+)/,
      /youtube\.com\/embed\/([^?]+)/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  }
}
