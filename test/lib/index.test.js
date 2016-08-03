'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;

describe('set global Map of instances', function() {
  const KEY = Symbol.for('My.App.Multiton');
  before(function() {
    expect(global).to.not.have.property(KEY);
    require('../../lib/index');
  });

  it('should set a new property where key is a Symbol to the global variable', function() {
    return expect(global[KEY]).to.exists;
  });

  it('should be a Map', function() {
    return expect(global[KEY]).to.be.a('Map');
  });
});

describe('constructor', function() {
  context('when configuration does not match existing instances', function() {
    let Multiton;
    const KEY = Symbol.for('My.App.Multiton');
    const configuration = {
      foo: 'toto',
      bar: 2,
    };
    const configurationHashString = [configuration.foo, configuration.bar].join('-');
    let instance;
    before(function() {
      Multiton = require('../../lib/index');
      global[KEY] = new Map();
      instance = new Multiton(configuration);
    });

    after(function() {
      global[KEY] = new Map();
    });

    it('should return an instance of Multiton', function() {
      expect(instance).to.be.an.instanceof(Multiton);
    });

    it('should set the instance in the global Map', function() {
      expect(global[KEY].has(configurationHashString)).to.equal(true);
      expect(global[KEY].get(configurationHashString)).to.equal(instance);
    });
  });

  context('when configuration matches an existing instances', function() {
    let Multiton;
    const KEY = Symbol.for('My.App.Multiton');
    const configuration = {
      foo: 'toto',
      bar: 2,
    };
    const configurationHashString = [configuration.foo, configuration.bar].join('-');
    let instance;
    before(function() {
      Multiton = require('../../lib/index');
      global[KEY] = new Map();
      global[KEY].set(configurationHashString, new Multiton(configuration));
      instance = new Multiton(configuration);
    });

    after(function() {
      global[KEY] = new Map();
    });

    it('should return an existing instance of Multiton', function() {
      expect(instance).to.be.equal(global[KEY].get(configurationHashString));
    });
  });
});
