import test from 'blue-tape';
import { remote } from 'webdriverio';


class AppiumHelper {
  constructor(defaultTimeout = 1000) {
    this.driver = this._getDriver();
    this.d = this.driver;
    this.defaultTimeout = defaultTimeout;
    this.w = {};
  }

  before(tape, done) {
    // We will handle errors, because tape is EventEmitter
    if (tape && tape.hasOwnProperty('on')) {
      tape.on('result', function (res) {
        if (res.error) {
          throw new Error(res.error);
        }
      });
    }

    // Use in test case as: before(SeleniumHelper.before)
    return this.driver.init(done);
  }

  after() {
    return this.driver.end();
  }

  test(asyncFunction) {
    const h = this;
    return (done) => {
      this.setDone(done);
      const context = {done, h};
      asyncFunction(context).then(() => this.checkErrors(done)).catch(e => done(e));
    };
  }

  setDone(done) {
    this.done = done;
  }

  _getDriver() {
    return remote({
      host: 'localhost',
      port: 4723,

      desiredCapabilities: {
        platformName: 'Android',
        deviceName: 'device',
        app: './android/app/build/outputs/apk/app-release.apk',
      },
      logLevel: 'debug',
      path: '/wd/hub',
    });
  }
}


async function simplefun(h, t) {
  await h.d.pause(2000);
  await h.d.waitForVisible('~searchInputAcc', 5000);
  await h.d.click('~searchInputAcc').keys('bold\n');
  await h.d.pause(3000);
  await h.d.saveScreenshot('output.png');
  t.ok(true, 'simplefun ok');
}

test('simple test', async function (t) {
  const h = new AppiumHelper();
  return Promise.resolve()
                .then(h.before.bind(h, this))

                .then(simplefun.bind(null, h, t))
  
                .then(h.after.bind(h))
                .catch(h.after.bind(h))
});
