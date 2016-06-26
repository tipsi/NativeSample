import test from 'blue-tape';
import { remote } from 'webdriverio';


class AppiumHelper {
  constructor(defaultTimeout = 1000) {
    this.driver = this._getDriver();
    this.driver.catch( e => {
      console.log(`# e ${e}`);
    })
    console.log(`# getdriver ${JSON.stringify(this._getDriver())}`);
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

  after(t, e) {
    if (e) {
      t.error(e);
    }
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

  getHost() {
    if (process.env.SAUCE) {
      const [user, pass] = process.env.SAUCE.split(':');
      console.log(`# Userpass: ${user} ${pass}`);
      return {host: 'ondemand.saucelabs.com',
              port: '80',
              user: user,
              key: pass,
      };
    }
    return {host: 'localhost',
            port: 4723,
    };
  }

  getApp() {
    if (process.env.SAUCE) {
      return {
        app: 'sauce-storage:release.apk',
        appiumVersion: '1.5.3',
        platformVersion: '5.1',
        platformName: 'Android',
        deviceName: 'Android Emulator',
        deviceOrientation: 'portrait',
        browserName: '',
      };
    }
    return {app: './android/app/build/outputs/apk/app-release.apk'};
  }

  _getDriver() {
    return remote({
      desiredCapabilities: {
        platformName: 'Android',
        deviceName: 'device',
        ...this.getApp()
      },
      logLevel: 'debug',
      path: '/wd/hub',
      ...this.getHost()
    });
  }
}


async function simplefun(h, t) {
  await h.d.pause(2000);
  await h.d.waitForVisible('~searchInputAcc', 5000);
  await h.d.click('~searchInputAcc').keys('bold\n');
  await h.d.pause(3000);
  await h.d.saveScreenshot(`output.${new Date().toJSON()}.png`);
  t.ok(true, 'simplefun ok');
}

test('simple test', async function (t) {
  const h = new AppiumHelper();
  return Promise.resolve()
                .then(h.before.bind(h, t, () => console.log(`# call done1`)))

                .then(simplefun.bind(null, h, t))
  
                .then(h.after.bind(h))
                .catch(h.after.bind(h, t))
});
