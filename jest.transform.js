const path = require("path")

// Requried to fix Swiper CSS imports during jest executions, it transforms imports into filenames
module.exports = {
  process: (_src, filename) => `module.exports = ${JSON.stringify(path.basename(filename))};`
}
