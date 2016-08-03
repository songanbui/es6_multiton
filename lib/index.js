'use strict';

const MULTITONKEY = Symbol.for('My.App.Multiton');
const globalSymbols = Object.getOwnPropertySymbols(global);
const hasMultitonMap = (globalSymbols.indexOf(MULTITONKEY) > -1);
if (!hasMultitonMap) {
  global[MULTITONKEY] = new Map();
}

class Multiton {
  /**
   * Creates a new Multiton instance if configuration does not match existing instance
   * Returns matching Multiton instance otherwise
   * @param {Object} configuration
   * @param {String} configuration.foo
   * @param {Number} configuration.bar
   */
  constructor(configuration) {
    const configurationHashString = [configuration.foo, configuration.bar].join('-');
    const hasMultitonInstance = global[MULTITONKEY].has(configurationHashString);
    if (!hasMultitonInstance) {
      this.foo = configuration.foo;
      this.bar = configuration.bar;
      this.date = new Date();
      global[MULTITONKEY].set(configurationHashString, this);
    } else {
      return global[MULTITONKEY].get(configurationHashString);
    }
  }

  /**
   * Displays some properties
   */
  hello() {
    console.log(`this.foo is : ${this.foo}`);
    console.log(`this.bar is : ${this.bar}`);
    console.log(`this.date is : ${this.date}`);
  }
}

module.exports = Multiton;
