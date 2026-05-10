import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Queue } from 'bullmq';
import { RedisService } from '../../common/redis/redis.service';

@Injectable()
export class JobsService implements OnModuleDestroy {
  private readonly logger = new Logger(JobsService.name);
  private queue?: Queue;

  constructor(private readonly redisService: RedisService) {}

  private getQueue(): Queue | null {
    const enabled = (process.env.BULLMQ_ENABLED ?? 'false') === 'true';
    const connection = this.redisService.getBullMQConnection();
    const queueName = process.env.COURSE_JOBS_QUEUE ?? 'course-jobs';

    if (!enabled || !connection) {
      return null;
    }

    if (!this.queue) {
      this.queue = new Queue(queueName, {
        connection,
      });
    }

    return this.queue;
  }

  async enqueueCourseStatsRecompute(courseId: string): Promise<{ queued: boolean }> {
    const queue = this.getQueue();
    if (!queue) {
      return { queued: false };
    }

    await queue.add(
      'course-stats-recompute',
      { courseId },
      {
        removeOnComplete: 100,
        removeOnFail: 100,
      },
    );

    this.logger.log(`Queued course stats recompute for ${courseId}`);
    return { queued: true };
  }

  async onModuleDestroy(): Promise<void> {
    await this.queue?.close();
  }
}
