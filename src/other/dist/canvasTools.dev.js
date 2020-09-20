"use strict";

var fs = require('fs');

var path = require('path');

var _require = require('canvas'),
    createCanvas = _require.createCanvas,
    loadImage = _require.loadImage;

var _require2 = require('vm'),
    createContext = _require2.createContext;

function generateColorSpectrum() {
  var imagePath, constraints, colorSpectrumArr, canvas, ctx, _imagePath, out, stream, r, g, b, y, x, rgb;

  return regeneratorRuntime.async(function generateColorSpectrum$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          imagePath = path.resolve(__dirname + '/spectrum.png');

          if (fs.existsSync(imagePath)) {
            _context.next = 13;
            break;
          }

          constraints = {
            width: 4096,
            height: 4096
          };
          colorSpectrumArr = [];
          canvas = createCanvas(constraints.width, constraints.height);
          ctx = canvas.getContext('2d');
          _imagePath = path.resolve(__dirname + '/spectrum.png');
          out = fs.createWriteStream(_imagePath);
          stream = canvas.createPNGStream();

          for (r = 0; r < 256; r++) {
            for (g = 0; g < 256; g++) {
              for (b = 0; b < 256; b++) {
                colorSpectrumArr.push([r, g, b]);
              }
            }
          }

          for (y = 0; y < constraints.height; y++) {
            for (x = 0; x < constraints.width; x++) {
              rgb = colorSpectrumArr[y * constraints.width + x];
              ctx.fillStyle = "rgb(".concat(rgb[0], ",").concat(rgb[1], ",").concat(rgb[2], ")");
              ctx.fillRect(x, y, 1, 1);
            }
          }

          stream.pipe(out);
          return _context.abrupt("return", new Promise(function (resolve, reject) {
            out.on('finish', function (arg) {
              resolve(_imagePath);
            });
            out.on('error', function (arg) {
              reject();
            });
          }));

        case 13:
          return _context.abrupt("return", new Promise(function (resolve, reject) {
            resolve(imagePath);
          }));

        case 14:
        case "end":
          return _context.stop();
      }
    }
  });
}

function generateNoise(width, height) {
  var canvas, ctx, imagePath, out, stream, y, x;
  return regeneratorRuntime.async(function generateNoise$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!(width > 0 && height > 0)) {
            _context2.next = 11;
            break;
          }

          canvas = createCanvas(width, height);
          ctx = canvas.getContext('2d');
          imagePath = path.resolve(__dirname + '/noise.png');
          out = fs.createWriteStream(imagePath);
          stream = canvas.createPNGStream();

          for (y = 0; y < height; y++) {
            for (x = 0; x < width; x++) {
              ctx.fillStyle = "rgb(".concat(Math.floor(Math.random() * Math.floor(255)), ",") + "".concat(Math.floor(Math.random() * Math.floor(255)), ",") + "".concat(Math.floor(Math.random() * Math.floor(255)), ")");
              ctx.fillRect(x, y, 1, 1);
              tempArr = null;
            }
          }

          stream.pipe(out);
          return _context2.abrupt("return", new Promise(function (resolve, reject) {
            out.on('finish', function (arg) {
              resolve(imagePath);
            });
            out.on('error', function (arg) {
              reject("Could not create image");
            });
          }));

        case 11:
          return _context2.abrupt("return", new Promise(function (resolve, reject) {
            reject("Invalid dimension");
          }));

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  });
}

module.exports = {
  generateColorSpectrum: generateColorSpectrum,
  generateNoise: generateNoise
};