/**@module Reporters*/

import Reporter from './Reporter';
import fs from 'fs';

/**
 * JSON reporter class
 * @extends Reporter
 */
class JsonReporter extends Reporter {
  /**
   * Initialize reporter
   *
   * @param {Object} metrics Metrics
   * @param {Object|Undefined} options Reporter options
   * @param {String} env Get environment for testing TODO: DI required instead of
   */
  constructor(metrics, options = {}, env = 'prod') {
    if (env === 'test') {
      fs.write = fs.writeFileSync;
    }

    const defaultOptions = {
      report_path: './zait.report.json'
    };

    super(metrics, Object.assign(defaultOptions, options));
  }

  /**
   * Write json report to file
   */
  report() {

    const jsonReport = JSON.stringify(this._metrics, null, 4);

    try {
      fs.write(this._options.report_path, jsonReport);

      this._reportSuccessMsg = `Success! JSON report was wrote in ${this._options.report_path}`;
      this.reportStatusCode = 0;
    } catch (e) {
      this.reportStatusCode = 1;

      this._reportFailMsg = e;
    }
  }
}

export default JsonReporter;
