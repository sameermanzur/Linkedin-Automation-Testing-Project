import {
  Reporter,
  TestCase,
  TestResult,
  FullResult
} from '@playwright/test/reporter';
import axios, { AxiosInstance } from 'axios';

// Load env vars
import 'dotenv/config';

interface ZephyrConfig {
  baseUrl: string;
  apiToken: string;
  projectKey: string;
  testCycleKey?: string;
  environment?: string;
  version?: string;
}

const zephyrConfig: ZephyrConfig = {
  baseUrl: process.env.ZEPHYR_BASE_URL || process.env.JIRA_BASE_URL || '',
  apiToken: process.env.ZEPHYR_AUTH_TOKEN || '',
  projectKey: process.env.ZEPHYR_PROJECT_KEY || '',
  testCycleKey: process.env.ZEPHYR_TEST_CYCLE_KEY,
  environment: process.env.ZEPHYR_ENVIRONMENT,
  version: process.env.ZEPHYR_VERSION,
};

class ZephyrReporter implements Reporter {
  private client: AxiosInstance;
  private testResults: Map<string, TestResult> = new Map();

  constructor() {
    if (!zephyrConfig.baseUrl || !zephyrConfig.apiToken || !zephyrConfig.projectKey) {
      throw new Error(
        '[ZephyrReporter] Missing required Zephyr config. Check your .env file'
      );
    }

    this.client = axios.create({
      baseURL: `${zephyrConfig.baseUrl}/rest/atm/1.0`,
      headers: {
        Authorization: `Bearer ${zephyrConfig.apiToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const testCaseKey = this.extractTestCaseKey(test);

    if (testCaseKey) {
      this.testResults.set(testCaseKey, result);
    } else {
      console.warn(
        `[zephyr reporter]: No Zephyr test case id found for test "${test.title}"`
      );
    }
  }

  async onEnd(result: FullResult) {
    console.log('\n📊 Reporting results to Zephyr...\n');

    for (const [testCaseKey, testResult] of this.testResults) {
      try {
        await this.createTestExecution(testCaseKey, testResult);
      } catch (error) {
        console.error(`❌ Failed to report ${testCaseKey}:`, error);
      }
    }

    console.log('\n✅ Zephyr reporting complete!\n');
  }

  private extractTestCaseKey(test: TestCase): string | null {
    // Support both formats: DUM-123 and DUM-T1
    const match = test.title.match(/\[([A-Z]+-[A-Z]*\d+)\]/);
    if (match) return match[1];

    const zephyrAnnotation = test.annotations.find((a) => a.type === 'zephyr');
    return zephyrAnnotation?.description ?? null;
  }

  private mapStatus(status: TestResult['status']): string {
    switch (status) {
      case 'passed':
        return 'Pass';
      case 'failed':
      case 'timedOut':
        return 'Fail';
      case 'skipped':
        return 'Not Executed';
      default:
        return 'Not Executed';
    }
  }

  private async createTestExecution(testCaseKey: string, result: TestResult) {
    const executionData = {
      projectKey: zephyrConfig.projectKey,
      testCaseKey,
      testCycleKey: zephyrConfig.testCycleKey,
      statusName: this.mapStatus(result.status),
      environment: zephyrConfig.environment,
      executionTime: result.duration,
      executedBy: 'Playwright Automation',
      comment: result.error
        ? result.error.message
        : 'Automated test execution',
    };

    const response = await this.client.post('/testexecutions', executionData);
    console.log(`✅ Test execution created for ${testCaseKey}: ${response.data.key}`);
  }
}

export default ZephyrReporter;
