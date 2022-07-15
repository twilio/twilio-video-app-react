const { spawn } = require('child_process');
const { Transform } = require('stream');
const stripColor = require('strip-color');

// This text that is generated by react-scripts doesn't work for
// this app (because it also needs a token server) so we are filtering
// it out in this script.
const TEXT_TO_EXCLUDE = `
The project was built assuming it is hosted at /.
You can control this with the homepage field in your package.json.

The build folder is ready to be deployed.
You may serve it with a static server:

  npm install -g serve
  serve -s build

Find out more about deployment here:

  bit.ly/CRA-deploy

`;

class Filter extends Transform {
  constructor() {
    super({
      readableObjectMode: true,
      writableObjectMode: true,
    });
  }

  _transform(chunk, _, next) {
    if (TEXT_TO_EXCLUDE.includes(stripColor(chunk.toString()))) {
      next();
    } else {
      next(null, chunk);
    }
  }
}

// Colors normally don't work when using spawn(), so here we re-enable colors.
process.env.FORCE_COLOR = require('supports-color').stdout.level;
process.env.REACT_APP_VERSION = require(__dirname + "/../package.json").version

const buildProcess = spawn('node', [require.resolve('react-scripts/scripts/build')]);

buildProcess.stderr.pipe(process.stderr);
buildProcess.stdout.pipe(new Filter()).pipe(process.stdout);
buildProcess.on('exit', process.exit);
