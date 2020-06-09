'use strict';

const Instance = require('./lib/instance')

setTimeout(() => {
  const instance = new Instance();
  instance.sayHi1();
  instance.sayHi2();
  instance.sayHi1();
  instance.sayHi2();
  instance.sayHi1();
}, 2000);

