let imgBtn = document.getElementById('imageInput')
const download = document.getElementById('download')
let canvas = document.getElementById('imgCanvas')
const topTextBtn = document.getElementById('topTextBtn')
const bottomTextBtn = document.getElementById('bottomTextBtn')
const startCropBtn = document.getElementById('startCropBtn')
const cropBtn = document.getElementById('cropBtn')
const restoreCropBtn = document.getElementById('restoreCropBtn')
const rotateLeftBtn = document.getElementById('rotateLeft')
const rotateRightBtn = document.getElementById('rotateRight')
const flipXBtn = document.getElementById('flipX')
const flipYBtn = document.getElementById('flipY')
let imgData
let context
let userImage
let cropper
flipXBtn.addEventListener('click',function() {
    cropper.scaleX(-1)
})
flipYBtn.addEventListener('click',function() {
    cropper.scaleY(-1)
})
rotateRightBtn.addEventListener('click', function() {
    cropper.rotate(45)
})
rotateLeftBtn.addEventListener('click', function() {
    cropper.rotate(-45)
})
startCropBtn.addEventListener('click', function() {
    startCropBtn.disabled = true
    cropBtn.disabled = false
    restoreCropBtn.disabled = false
    rotateLeftBtn.disabled = false
    rotateRightBtn.disabled = false
    flipXBtn.disabled = false
    flipYBtn.disabled = false
    cropper = new Cropper(canvas,{crop(event) {
            console.log(event.detail.x);
            console.log(event.detail.y);
            console.log(event.detail.width);
            console.log(event.detail.height);
            console.log(event.detail.rotate);
            console.log(event.detail.scaleX);
            console.log(event.detail.scaleY);
        },viewMode: 2, dragMode: 'crop',})
})
cropBtn.addEventListener('click', function() {
    const image = cropper.getCroppedCanvas()
    /*const link = document.createElement('a')
    link.download = 'download.png'
    link.href = image
    link.click()
    link.delete()*/
    cropper.destroy()
    context = canvas.getContext('2d')
    canvas.height = image.height
    canvas.width = image.width
    context.drawImage(image,0,0)
    startCropBtn.disabled = false
    cropBtn.disabled = true
    restoreCropBtn.disabled = true
    rotateLeftBtn.disabled = true
    rotateRightBtn.disabled = true
    flipXBtn.disabled = true
    flipYBtn.disabled = true
})
restoreCropBtn.addEventListener('click', function() {
    cropper.destroy()
    context = canvas.getContext('2d')
    canvas.width = userImage.width
    canvas.height = userImage.height
    context.drawImage(userImage,0,0)

    imgData = canvas.toDataURL("image/png",1.0)
    startCropBtn.disabled = false
    cropBtn.disabled = true
    restoreCropBtn.disabled = true
    rotateLeftBtn.disabled = true
    rotateRightBtn.disabled = true
    flipXBtn.disabled = true
    flipYBtn.disabled = true
})

topTextBtn.addEventListener('click', function() {
    context.font = "36pt Impact";
    context.fillStyle = "white"
    context.strokeStyle = "black"
    context.textAlign = "center"
    const text = document.getElementById('topText').value
    wrapText(text,canvas.width/2,canvas.height/8,canvas.width,50)
})

bottomTextBtn.addEventListener('click', function() {
    context.font = "36pt Impact";
    context.fillStyle = "white"
    context.strokeStyle = "black"
    context.textAlign = "center"
    const text = document.getElementById('bottomText').value
    wrapText(text,canvas.width/2,canvas.height-(canvas.height/12),canvas.width,50)
})

function wrapText(text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';

    for(let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' '
        const metrics = context.measureText(testLine)
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y)
            context.strokeText(line, x, y)
            line = words[n] + ' '
            y += lineHeight
        }
        else {
            line = testLine
        }
    }
    context.fillText(line, x, y)
    context.strokeText(line,x,y)
}

download.addEventListener('click', function() {
    const link = document.createElement('a')
    link.download = 'download.png'
    link.href = canvas.toDataURL()
    link.click()
    link.delete()
});
imgBtn.addEventListener('change', function(event) {
    if(event.target.files) {//If files
        let imageFile = event.target.files[0]
        const reader = new FileReader();
        reader.readAsDataURL(imageFile)
        reader.onloadend = function(event) {
            userImage = new Image()
            // noinspection JSValidateTypes
            userImage.src = event.target.result
            userImage.onload = function () {
                context = canvas.getContext('2d')
                canvas.width = userImage.width
                canvas.height = userImage.height
                context.drawImage(userImage,0,0)
                startCropBtn.disabled = false
                imgData = canvas.toDataURL("image/png",1.0)
            }
        }
    }
})