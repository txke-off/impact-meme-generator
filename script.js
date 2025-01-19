const downloadBtn = document.getElementById("download-meme");
const uploadImage = document.getElementById("upload-image");
const canvas = document.getElementById("meme-canvas");
const ctx = canvas.getContext("2d")
const topText = document.getElementById("top-text");
const bottomText = document.getElementById("bottom-text");
const fontSizeSlider = document.getElementById("font-size-slider");

const minw = 300;
const minh = 300;
const maxw = 800;
const maxh = 800;

let fontSize = parseInt(fontSizeSlider.value, 10);
let image = new Image();

uploadImage.addEventListener("change", e => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            image.src = reader.result;
        };
        reader.readAsDataURL(file);
    }
});

const wrapTopText = (text, x, startY, maxWidth, lineHeight) => {
    const words = text.split(" ");
    let line = "";
    let lines = [];

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const testWidth = ctx.measureText(testLine).width;
        if (testWidth > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + " ";
        } else {
            line = testLine;
        }
    }
    lines.push(line);

    lines.forEach((line, index) => {
        const y = startY + lineHeight * (index + 1);
        ctx.fillText(line.trim(), x, y);
        ctx.strokeText(line.trim(), x, y);
    });
};

const wrapBottomText = (text, x, y, maxWidth, lineHeight) => {
    const words = text.split(" ");
    let line = "";
    let lines = [];

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const testWidth = ctx.measureText(testLine).width;
        if (testWidth > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + " ";
        } else {
            line = testLine;
        }
    }
    lines.push(line);

    lines.reverse().forEach((line, index) => {
        ctx.fillText(line.trim(), x, y - index * lineHeight);
        ctx.strokeText(line.trim(), x, y - index * lineHeight);
    });
};

const drawMeme = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.textAlign = "center";
    ctx.font = `${fontSize}px Impact`;

    if (topText.value) {
        wrapTopText(
          topText.value.toUpperCase(),
          canvas.width / 2,
          0,
          canvas.width - 20,
          fontSize + 10
        );
    }
    
    if (bottomText.value) {
        wrapBottomText(
            bottomText.value.toUpperCase(),
            canvas.width / 2,
            canvas.height - 20,
            canvas.width - 20,
            fontSize + 10
        );
    }
};

image.onload = () => {
    let width = image.width;
    let height = image.height;
    
    if (width < minw || height < minh) {
        const scale = Math.max(minw / width, minh / height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
    }
    if (width > maxw || height > maxh) {
        const scale = Math.min(maxw / width, maxh / height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
    }

    canvas.width = width;
    canvas.height = height;
    drawMeme();
};

topText.addEventListener("input", drawMeme);
bottomText.addEventListener("input", drawMeme);

fontSizeSlider.addEventListener("input", (e) => {
    fontSize = parseInt(e.target.value, 10);
    drawMeme();
});

downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "meme.png";
    link.href = canvas.toDataURL();
    link.click();
});