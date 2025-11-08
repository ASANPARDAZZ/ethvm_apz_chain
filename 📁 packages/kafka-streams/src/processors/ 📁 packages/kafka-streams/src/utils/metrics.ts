import client from 'prom-client';

export class PrometheusMetrics {
  private transactionCounter: client.Counter;
  private processingDuration: client.Histogram;
  private errorCounter: client.Counter;
  private blockGauge: client.Gauge;

  constructor() {
    this.transactionCounter = new client.Counter({
      name: 'apz_transactions_processed_total',
      help: 'Total number of APZ transactions processed',
      labelNames: ['status', 'type']
    });

    this.processingDuration = new client.Histogram({
      name: 'apz_processing_duration_seconds',
      help: 'Time taken to process APZ transactions',
      buckets: [0.1, 0.5, 1, 2, 5]
    });

    this.errorCounter = new client.Counter({
      name: 'apz_processing_errors_total',
      help: 'Total number of processing errors',
      labelNames: ['error_type']
    });

    this.blockGauge = new client.Gauge({
      name: 'apz_latest_block_number',
      help: 'Latest APZ block number processed'
    });
  }

  recordTransactionProcessed(status: string, duration: number): void {
    this.transactionCounter.inc({ status });
    this.processingDuration.observe(duration / 1000);
  }

  recordError(errorType: string): void {
    this.errorCounter.inc({ error_type: errorType });
  }

  updateLatestBlock(blockNumber: number): void {
    this.blockGauge.set(blockNumber);
  }
}
