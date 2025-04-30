const path = require("path")

// Required to fix Swiper CSS imports during jest executions, it transforms imports into filenames
module.exports = {
  process: (_src, filename) => {
    return {
      code: `module.exports = ${JSON.stringify(path.basename(filename))};`
    };
  }
}
