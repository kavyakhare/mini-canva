const canvas = document.querySelector("canvas"),
ctx = canvas.getContext("2d"),
toolbtns = document.querySelectorAll(".tool"),
fillcolor = document.querySelector("#fill-color"),
sizeslider = document.querySelector("#size-slider"),
brushcolor = document.querySelectorAll(".colors .option"),
colorpicker = document.querySelector("#color-picker"),
clearcanvas = document.querySelector(".clear-canvas"),
saveimg = document.querySelector(".save-img");

let isDrawing = false,
brushWidth = 5,
selectedTool = "brush",
prevMouseX,prevMouseY,snapshot,
selectedcolor = "#000";
const setCanvasbg = () =>
{
    ctx.fillStyle = "#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = selectedcolor;
}
window.addEventListener("load" , () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasbg();
});


const drawRectangle = (e) =>
{
    if(fillcolor.checked)
    {
        return ctx.fillRect(e.offsetX , e.offsetY , prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.strokeRect(e.offsetX , e.offsetY , prevMouseX - e.offsetX , prevMouseY - e.offsetY);
    
}
const drawCircle = (e) =>
{
    ctx.beginPath();
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX),2) + Math.pow((prevMouseY - e.offsetY),2));
    ctx.arc(prevMouseX, prevMouseY , radius , 0 ,2*Math.PI);
    ctx.closePath();
    fillcolor.checked ? ctx.fill() : ctx.stroke();
}
const drawTraingle = (e) =>
{
    ctx.beginPath();
    ctx.moveTo(prevMouseX,prevMouseY);
    ctx.lineTo(e.offsetX,e.offsetY);
    ctx.lineTo(2 * prevMouseX - e.offsetX, e.offsetY);
    ctx.closePath();
    fillcolor.checked?ctx.fill():ctx.stroke();
}
const startDraw = (e) => 
{
    isDrawing = true;
    ctx.beginPath();

    prevMouseX = e.offsetX;
    prevMouseY = e.offsetY;
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle = selectedcolor;
    ctx.fillStyle = selectedcolor;
    snapshot = ctx.getImageData(0,0,canvas.width,canvas.height);
}
const drawing = (e) =>
{
    if(!isDrawing) return;
    ctx.putImageData(snapshot,0,0);
    if(selectedTool === "brush" || selectedTool === "eraser")
    {
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedcolor;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }
    else if(selectedTool === "rectangle")
    {
        drawRectangle(e);
    }
    else if(selectedTool === "traingle")
    {
        drawTraingle(e);
    }
    else
    {
        drawCircle(e);
    }
}
const endDraw = () => 
{
    isDrawing = false;
}

toolbtns.forEach(btn => {
    btn.addEventListener("click" , () => {
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
        console.log(selectedTool);
    });
});
clearcanvas.addEventListener("click" , () =>
{
    ctx.clearRect(0,0,canvas.width, canvas.height);
    setCanvasbg();
});
colorpicker.addEventListener("change" , () => {
    colorpicker.parentElement.style.background = colorpicker.value;
    colorpicker.parentElement.click();
});
sizeslider.addEventListener("change" ,() => brushWidth = sizeslider.value);
brushcolor.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        selectedcolor = window.getComputedStyle(btn).getPropertyValue("background-color");
        console.log(btn);
    });
});
saveimg.addEventListener("click" , () => {
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
});
canvas.addEventListener("mousedown" ,startDraw);
canvas.addEventListener("mousemove" ,drawing);
canvas.addEventListener("mouseup" ,endDraw);