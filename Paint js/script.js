// Canvas Variables
const canvas = document.querySelector("canvas"),
ctx = canvas.getContext("2d");
const toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorPicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-img");

/* Global variables with default value */
let snapshot;
let isDrawing = false;
let selectedTool = "brush";
// Mouse Coordinates
let prevMouseX, prevMouseY;
// Brush Variables
let brushWidth = 5;
let selectedColor = "#000";

const setCanvasBackground = () => {
    // setting whole canvas background to white, so the downloaded img background will be white
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // setting fillstyle back to the selectedColor, it'll be the brush color
    ctx.fillStyle = selectedColor;
}

window.addEventListener("load", () => {
    // setting canvas width/height.. offsetwidth/height returns viewable width/height of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasBackground();
});

const drawRect = (e) => {
    // if fillColor isn't checked draw a rect with border else draw rect with background
    if(!fillColor.checked) {
        // creating circle according to the mouse pointer
        return ctx.strokeRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
}

const drawCircle = (e) => {
    // Creates the new path to draw circle
    ctx.beginPath();
    // Getting radius for circle according to the mouse pointer
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2));
    // Creates the circle according to the mouse pointer
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke(); // if fillColor is checked fill circle else draw border circle
}

const drawTriangle = (e) => {
    // Creates the new path to draw circle
    ctx.beginPath();
    // moving triangle to the mouse pointer
    ctx.moveTo(prevMouseX, prevMouseY);
    // creating first line according to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY);
    // creating bottom line of triangle
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    // closing path of a triangle so the third line draw automatically
    ctx.closePath();
    // if fillColor is checked fill triangle else draw border
    fillColor.checked ? ctx.fill() : ctx.stroke();
}

const startDraw = (e) => {
    isDrawing = true;
    // Passing current mouseX position as prevMouseX value
    prevMouseX = e.offsetX;
    // passing current mouseY position as prevMouseY value
    prevMouseY = e.offsetY;
    // creating new path to draw
    ctx.beginPath();
    // passing brushSize as line width
    ctx.lineWidth = brushWidth;
    // passing selectedColor as stroke style
    ctx.strokeStyle = selectedColor;
    // passing selectedColor as fill style
    ctx.fillStyle = selectedColor;
    // copying canvas data & passing as snapshot value.. this avoids dragging the image
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const drawing = (e) => {
    // if isDrawing is false return from here
    if(!isDrawing) return;
    // adding copied canvas data on to this canvas
    ctx.putImageData(snapshot, 0, 0);

    if(selectedTool === "brush" || selectedTool === "eraser") {
        // if selected tool is eraser then set strokeStyle to white 
        // to paint white color on to the existing canvas content else set the stroke color to selected color
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        
        // Creates the line according to the mouse pointer
        // drawing/filling line with color
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } else if(selectedTool === "rectangle"){
        drawRect(e);
    } else if(selectedTool === "circle"){
        drawCircle(e);
    } else {
        drawTriangle(e);
    }
}

toolBtns.forEach(btn => {
    btn.addEventListener("click", () => { // adding click event to all tool option
        // removing active class from the previous option and adding on current clicked option
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    });
});

// Passing slider value as brushSize
sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value);

colorBtns.forEach(btn => {
    // Adding click event to all color button
    btn.addEventListener("click", () => {
        // removing selected class from the previous option and adding on current clicked option
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        // passing selected btn background color as selectedColor value
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

colorPicker.addEventListener("change", () => {
    // passing picked color value from color picker to last color btn background
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
});

// Clears the canvas
clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCanvasBackground();
});

saveImg.addEventListener("click", () => {
    // creating <a> element
    const link = document.createElement("a");
    // passing current date as link download value
    link.download = `${Date.now()}.jpg`;
    // passing canvasData as link href value
    link.href = canvas.toDataURL();
    // clicking link to download image
    link.click();
});

// startDraw - Starts drawing when the mouse is clicked on the canvas
// drawing - Follows the mouse and draws on the canvas while it's still clicked
// isDrawing - Checks if the mouse is still clicked on the canvas, if it isn't it stops drawing
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);
