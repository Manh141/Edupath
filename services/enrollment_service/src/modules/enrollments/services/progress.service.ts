import { Injectable } from '@nestjs/common';

@Injectable()
export class ProgressService {
  calculateProgress(completedLectures: number, totalLectures: number): number {
    if (totalLectures <= 0) {
      return 0;
    }

    return Number(((completedLectures / totalLectures) * 100).toFixed(2));
  }

  isCompleted(progressPercent: number): boolean {
    return progressPercent >= 100;
  }
}
