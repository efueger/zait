import commandBuilder from './commandBuilder';
import yaml from 'js-yaml';
import typeOf from 'typeof';

/**
 * Parser class
 */
class Parser {

  /**
   * Set parser config and parser type
   *
   * @param {String} confParser Parser type
   * @param {String} config Raw Zait configuration
   */
  constructor(confParser, config) {
    this.confParser = confParser;
    this.config = config;
  }

  /**
   * Get parsed config file
   *
   * @throws {Error} Throw error if there is no commandBuilder for a file.
   * @type {JSON}
   */
  get parsedConfig() {
    switch (this.confParser) {
      case 'json':
        return JSON.parse(this.config);
      case 'yml':
        return yaml.load(this.config);
      default:
        throw new Error('There is no parser for this file.'); //@TODO make custom errors
    }
  }

  /**
   * Get parsed commands
   *
   * @type {Array}
   */
  get parsedCommands() {
    return commandBuilder.buildCommands(this.parsedConfig.commands);
  }

  /**
   * Get reporter
   *
   * @type {Object}
   */
  get reporter() {
    let reporter = {
      name: undefined,
      options: {}
    };

    if (!this.parsedConfig.reporter) {
      return { name: 'json' };
    }

    if (typeOf(this.parsedConfig.reporter) === 'string') {
      return { name: this.parsedConfig.reporter };
    }

    reporter.name = this.parsedConfig.reporter.name;
    reporter.options = Object.assign({}, this.parsedConfig.reporter);
    delete reporter.options.name;

    return reporter;
  }
}

export default Parser;
