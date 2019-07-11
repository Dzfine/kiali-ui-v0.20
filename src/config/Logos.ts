// All logo images go in here

// Kiali logo
export const mspLogo = require('../assets/img/MSP-login.svg');

// Runtimes
export const runtimesLogoProviders = {
  'Vert.x': () => require('../assets/img/vertx-logo.png'),
  'Node.js': () => require('../assets/img/nodejs-logo.png'),
  Thorntail: () => require('../assets/img/thorntail-logo.png'),
  Go: () => require('../assets/img/go-logo.png'),
  MicroProfile: () => require('../assets/img/microprofile-logo.png'),
  JVM: () => require('../assets/img/java-logo.png')
};
