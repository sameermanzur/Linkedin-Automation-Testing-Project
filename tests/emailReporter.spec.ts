import { expect, test } from '@playwright/test';
import type { TestError } from '@playwright/test';
import type { FinalResult, Summary } from '../reporters/emailReporter';
import { buildEmailContent } from '../reporters/emailReporter';

test.describe('EmailReporter helpers', () => {
  test('buildEmailContent summarises the results', () => {
    const summary: Summary = {
      total: 3,
      passed: 1,
      failed: 1,
      skipped: 1,
      timedOut: 0,
      flaky: 0,
      startTime: new Date('2024-01-01T10:00:00.000Z'),
      endTime: new Date('2024-01-01T10:05:30.000Z'),
    };

    const results: FinalResult[] = [
      {
        title: 'suite › passes',
        status: 'passed',
        duration: 1234,
      },
      {
        title: 'suite › fails',
        status: 'failed',
        duration: 3000,
        error: { message: 'Example failure' } as TestError,
      },
      {
        title: 'suite › skipped',
        status: 'skipped',
        duration: 0,
      },
    ];

    const content = buildEmailContent(summary, results, { subjectPrefix: 'CI' });

    expect(content.subject).toBe('CI Test Results: 1/3 passed');
    expect(content.text).toContain('Total: 3');
    expect(content.text).toContain('- [FAILED] suite › fails (3s)');
    expect(content.text).toContain('Example failure');
  });
});
