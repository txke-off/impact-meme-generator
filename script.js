const downloadBtn = document.getElementById("download-meme");
const uploadImage = document.getElementById("upload-image");
const canvas = document.getElementById("meme-canvas");
const ctx = canvas.getContext("2d")
const topText = document.getElementById("top-text");
const bottomText = document.getElementById("bottom-text");

const minw = 300;
const minh = 300;
const maxw = 800;
const maxh = 800;

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

const drawText = (text, x, y) => {
    let fontSize = 50;
    ctx.font = `${fontSize}px Impact`

    while (ctx.measureText(text).width > canvas.width - 20) {
        fontSize -= 1;
        ctx.font = `${fontSize}px Impact`;
    }

    ctx.fillText(text, x, y);
    ctx.strokeText(text, x, y);
}

const drawMeme = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.textAlign = "center";

    if (topText.value) {
        drawText(topText.value.toUpperCase(), canvas.width / 2, 60);
    }

    if (bottomText.value) {
        drawText(bottomText.value.toUpperCase(), canvas.width / 2, canvas.height - 20);
    }
};

image.onload = () => {
    let width = image.width;
    let height = image.height;
    if (width > maxw || height > maxh) {
        const scale = Math.min(maxw / width, maxh / height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
    }
    if (width < minw || height < minh) {
        const scale = Math.max(minw / width, minh / height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
    canvas.width = width;
    canvas.height = height;
    drawMeme();
  };

topText.addEventListener("input", drawMeme);
bottomText.addEventListener("input", drawMeme);

downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "meme.png";
    link.href = canvas.toDataURL();
    link.click();
});