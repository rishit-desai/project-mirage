let image = null;
let grayImg = null;
let redImg = null;
let blurImg = null;
let rainbowImg = null;
let frameImg = null;
let reset = null;
let canvas1 = document.getElementById("can1");
let download = document.getElementById("downloadBtn");
download.addEventListener("click", downloadImage);
let pixelArray = [];

function load() {
  let fileinput = document.getElementById("image");

  // convert the file to array of pixels

  let file = fileinput.files[0];
  let reader = new FileReader();
  reader.onload = function (event) {
    let img = new Image();
    img.onload = function () {
      let canvas = document.createElement("canvas");
      let context = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      const width = img.width;
      const height = img.height;
      context.drawImage(img, 0, 0);
      let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      let pixels = imageData.data;
      for (let i = 0; i<width; i++) {
        let row = [];
        for (let j = 0; j<height; j++) {
          let index = (i + j * width) * 4;
          let r = pixels[index];
          let g = pixels[index + 1];
          let b = pixels[index + 2];
          let pixel = [r, g, b]
          row.push(pixel);
        }
        pixelArray.push(row);
      }
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);

  image = new SimpleImage(fileinput);
  grayImg = new SimpleImage(fileinput);
  redImg = new SimpleImage(fileinput);
  blurImg = new SimpleImage(fileinput);
  rainbowImg = new SimpleImage(fileinput);
  frameImg = new SimpleImage(fileinput);
  reset = new SimpleImage(fileinput);
  image.drawTo(canvas1);
}
function downloadImage() {
  // Grab the canvas element
  let canvas = document.getElementById("canvas");

  /* Create a PNG image of the pixels drawn on the canvas using the toDataURL method. PNG is the preferred format since it is supported by all browsers
   */
  var dataURL = canvas1.toDataURL("image/png");

  // Create a dummy link text
  var a = document.createElement("a");
  // Set the link to the image so that when clicked, the image begins downloading
  a.href = dataURL;
  // Specify the image filename
  a.download = "canvas-download.jpeg";
  // Click on the link to set off download
  a.click();
}

function getImage(filterName)
{
  // send the pixel array to the server
  fetch(`/filter/${filterName}`, {
    method: "POST",
    body: JSON.stringify({ pixelArray: pixelArray }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) =>
  {
    response.json().then((data) =>
    {
      // data is array of pixels
      let canvas = document.getElementById("can1");
      let context = canvas.getContext("2d");
      const width = data.length;
      const height = data[0].length;
      canvas.width = width;
      canvas.height = height;
      for (let i = 0; i<width; i++) {
        for (let j = 0; j<height; j++) {
          let pixel = data[i][j];
          if (typeof pixel === "number") {
            context.fillStyle = `rgb(${pixel}, ${pixel}, ${pixel})`;
            context.fillRect(i, j, 1, 1);
          }
          else
          {
            context.fillStyle = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
            context.fillRect(i, j, 1, 1);
          }
        }
      }
    });
  });
}

function doGray() {
  notloaded();
  for (let pixel of grayImg.values()) {
    let avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue()) / 3;
    pixel.setRed(avg);
    pixel.setGreen(avg);
    pixel.setBlue(avg);
  }
  grayImg.drawTo(canvas1);
  alert("Grayscale filter is applying. Click OK to proceed.");
  console.log(grayImg.values());
}

function doRed() {
  notloaded();
  for (let pixel of redImg.values()) {
    if (pixel.getRed() < 250) {
      pixel.setRed(250);
    }
  }
  redImg.drawTo(canvas1);
  alert("Red filter is applying. Click OK to proceed.");
}

function doFrame() {
  notloaded();
  let height = frameImg.getHeight();
  let width = frameImg.getWidth();
  for (let pixel of frameImg.values()) {
    if (
      pixel.getY() > height - 30 ||
      pixel.getY() < 30 ||
      pixel.getX() > width - 30 ||
      pixel.getX() < 30
    ) {
      pixel.setRed(128);
      pixel.setGreen(128);
      pixel.setBlue(0);
    }
  }
  frameImg.drawTo(canvas1);
  alert("Frame filter is applying. Click OK to proceed.");
}

function doClear() {
  notloaded();
  for (let pixel of reset.values()) {
    let Pixels = image.getPixel(pixel.getX(), pixel.getY());
    reset.setPixel(pixel.getX(), pixel.getY(), Pixels);
  }
  reset.drawTo(canvas1);
}

function doRainbow() {
  notloaded();
  let width = rainbowImg.getWidth();
  let height = rainbowImg.getHeight();
  for (let pixel of rainbowImg.values()) {
    let x = pixel.getX();
    let y = pixel.getY();
    let avg = (pixel.getRed() + pixel.getGreen() + pixel.getGreen()) / 3;
    if (y < height / 10) {
      pixel.setRed(2 * avg);
      pixel.setGreen(0);
      pixel.setBlue(0);
    }
    if (y > height / 10 && y < (2 * height) / 10) {
      pixel.setRed(2 * avg);
      pixel.setGreen(avg);
      pixel.setBlue(0);
    }
    if (y > (2 * height) / 10 && y < (3 * height) / 10) {
      pixel.setRed(2 * avg);
      pixel.setGreen(2 * avg);
      pixel.setBlue(0);
    }
    if (y > (3 * height) / 10 && y < (4 * height) / 10) {
      pixel.setRed(0);
      pixel.setGreen(2 * avg);
      pixel.setBlue(0);
    }
    if (y > (4 * height) / 10 && y < (5 * height) / 10) {
      pixel.setRed(0);
      pixel.setGreen(2 * avg);
      pixel.setBlue(avg);
    }
    if (y > (5 * height) / 10 && y < (6 * height) / 10) {
      pixel.setRed(0);
      pixel.setGreen(2 * avg);
      pixel.setBlue(2 * avg);
    }
    if (y > (6 * height) / 10 && y < (7 * height) / 10) {
      pixel.setRed(0);
      pixel.setGreen(0);
      pixel.setBlue(2 * avg);
    }
    if (y > (7 * height) / 10 && y < (8 * height) / 10) {
      pixel.setRed(avg);
      pixel.setGreen(0);
      pixel.setBlue(avg);
    }
    if (y > (8 * height) / 10 && y < (9 * height) / 10) {
      pixel.setRed(avg);
      pixel.setGreen(avg);
      pixel.setBlue(avg);
    }
  }
  rainbowImg.drawTo(canvas1);
  alert("Rainbow filter is applying. Click OK to proceed.");
}

function doBlur() {
  notloaded();
  let width = blurImg.getWidth();
  let height = blurImg.getHeight();
  for (let pixel of blurImg.values()) {
    let num = Math.random();
    let dot = Math.ceil(num * 10);
    let x = pixel.getX();
    let y = pixel.getY();
    let newX = Math.min(x + dot, width - 1);
    let newY = Math.min(y + dot, height - 1);
    if (num < 5) {
      let pixel2 = blurImg.getPixel(newX, newY);
      blurImg.setPixel(x, y, pixel2);
    }
  }
  blurImg.drawTo(canvas1);
  alert("Blur filter is applying. Click OK to proceed.");
}

function doEdgeDetection() {
  function checkIfCornerPixel(image, x, y) {
    if (x == 0 || y == 0) {
      return true;
    }
    if (x == image.getWidth() - 1 || y == image.getHeight() - 1) {
      return true;
    }
    return false;
  }

  function robertsFilter(image) {
    let output = new SimpleImage(image.getWidth(), image.getHeight());
    for (let pixel of image.values()) {
      let x = pixel.getX();
      let y = pixel.getY();
      if (checkIfCornerPixel(image, x, y)) {
        output.setPixel(x, y, output.getPixel(x, y));
        continue;
      }
      let leftPixel = image.getPixel(x, y);
      let rightPixel = image.getPixel(x + 1, y + 1);
      let diff = Math.abs(leftPixel.getRed() - rightPixel.getRed());
      output.setPixel(x, y, output.getPixel(x, y));
    }
    return output;
  }

  function prewittFilter(image) {
    let output = new SimpleImage(image.getWidth(), image.getHeight());
    for (let pixel of image.values()) {
      let x = pixel.getX();
      let y = pixel.getY();
      if (checkIfCornerPixel(image, x, y)) {
        output.setPixel(x, y, output.getPixel(x, y));
        continue;
      }
      let topPixel = image.getPixel(x, y);
      let bottomPixel = image.getPixel(x, y + 1);
      let diff = Math.abs(topPixel.getRed() - bottomPixel.getRed());
      output.getPixel(x, y).setRed(diff);
      output.getPixel(x, y).setGreen(diff);
      output.getPixel(x, y).setBlue(diff);
    }
    return output;
  }

  function sobelFilter(image) {
    let output = new SimpleImage(image.getWidth(), image.getHeight());
    for (let pixel of image.values()) {
      let x = pixel.getX();
      let y = pixel.getY();
      if (checkIfCornerPixel(image, x, y)) {
        output.setPixel(x, y, output.getPixel(x, y));
        continue;
      }
      let topLeftPixel = image.getPixel(x - 1, y - 1);
      let topRightPixel = image.getPixel(x + 1, y - 1);
      let bottomLeftPixel = image.getPixel(x - 1, y + 1);
      let bottomRightPixel = image.getPixel(x + 1, y + 1);
      let diffX = Math.abs(
        topLeftPixel.getRed() +
          2 * topRightPixel.getRed() +
          bottomLeftPixel.getRed() -
          2 * bottomRightPixel.getRed()
      );
      let diffY = Math.abs(
        topLeftPixel.getRed() +
          2 * bottomLeftPixel.getRed() +
          topRightPixel.getRed() -
          2 * bottomRightPixel.getRed()
      );
      let diff = Math.sqrt(diffX * diffX + diffY * diffY);
      output.getPixel(x, y).setRed(diff);
      output.getPixel(x, y).setGreen(diff);
      output.getPixel(x, y).setBlue(diff);
    }
    return output;
  }

  // combine the filters
  let roberts = robertsFilter(image);
  let prewitt = prewittFilter(image);
  let sobel = sobelFilter(image);
  let output = new SimpleImage(image.getWidth(), image.getHeight());
  for (let pixel of image.values()) {
    let x = pixel.getX();
    let y = pixel.getY();
    if (checkIfCornerPixel(image, x, y)) {
      output.setPixel(x, y, output.getPixel(x, y));
      continue;
    }
    let r = roberts.getPixel(x, y).getRed();
    let p = prewitt.getPixel(x, y).getRed();
    let s = sobel.getPixel(x, y).getRed();
    let max = Math.max(r, p, s);
    output.getPixel(x, y).setRed(max);
    output.getPixel(x, y).setGreen(max);
    output.getPixel(x, y).setBlue(max);
  }
  output.drawTo(canvas1);
  alert("Edge detection filter is applying. Click OK to proceed.");
}

function notloaded() {
  if (image == null || !image.complete()) {
    alert("Image is not loaded.");
  }
}
