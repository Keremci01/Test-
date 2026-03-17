
/* ================= GLOBAL ================= */

let mode="function"
let currentPlot=null

/* ================= MENU ================= */

function toggleMenu(){
let m=document.getElementById("menu")
m.style.display = m.style.display==="block"?"none":"block"
}

function toggleGroup(id){

let g=document.getElementById(id)

if(g.style.display==="block"){
g.style.display="none"
return
}

document.querySelectorAll("#menu div").forEach(el=>{
if(el.id.includes("Group")) el.style.display="none"
})

g.style.display="block"
}

function toggleDark(){
document.body.classList.toggle("dark")
}

/* ================= MODE ================= */

function hideInputs(){

func2.style.display="none"
func3.style.display="none"
a.style.display="none"
b.style.display="none"
x0.style.display="none"
x1.style.display="none"
y1.style.display="none"
x2.style.display="none"
y2.style.display="none"

}

function setMode(m){

mode=m

hideInputs()
plot.innerHTML=""
result.innerHTML=""
tableContainer.innerHTML=""

document.getElementById("calculator").style.display="none"
document.getElementById("plot").style.display="block"
document.getElementById("graphButtons").style.display="block"
func.style.display="inline"

let btn=document.getElementById("intersectBtn")
btn.style.display="none"

if(m==="function"){
title.innerText="Fonksiyon Grafiği"
}

if(m==="multi"){
title.innerText="Çoklu Fonksiyon"
func2.style.display="inline"
func3.style.display="inline"
btn.style.display="inline-block"
}

if(m==="derivative"){
title.innerText="Türev"
}

if(m==="integral"){
title.innerText="İntegral"
a.style.display="inline"
b.style.display="inline"
}

if(m==="tangent"){
title.innerText="Teğet"
x0.style.display="inline"
}

if(m==="limit"){
title.innerText="Limit"
x0.style.display="inline"
}

if(m==="distance"){
title.innerText="Mesafe"
x1.style.display="inline"
y1.style.display="inline"
x2.style.display="inline"
y2.style.display="inline"
}

if(m==="calculator"){
title.innerText="Hesap Makinesi"
calculator.style.display="block"
plot.style.display="none"
graphButtons.style.display="none"
func.style.display="none"
}

}

/* ================= DRAW ================= */

function draw(){

plot.innerHTML=""
result.innerHTML=""
tableContainer.innerHTML=""

let f=func.value

try{

let config={
target:"#plot",
width:plot.clientWidth,
height:400,
grid:true,
zoom:true,
pan:true,
data:[]
}

if(mode==="function"){
config.data=[{fn:f}]
}

if(mode==="multi"){

let data=[{fn:f}]

if(func2.value) data.push({fn:func2.value})
if(func3.value) data.push({fn:func3.value})

config.data=data
}

if(mode==="derivative"){
let d=math.derivative(f,"x").toString()
result.innerHTML="f'(x)="+d
config.data=[{fn:f},{fn:d}]
}

if(mode==="integral"){

let aVal=Number(a.value)
let bVal=Number(b.value)

config.data=[
{fn:f},
{fn:f,range:[aVal,bVal],closed:true,color:"rgba(0,0,255,0.3)"}
]
}

if(mode==="tangent"){

let x=Number(x0.value)
let d=math.derivative(f,"x")
let slope=d.evaluate({x:x})
let y=math.evaluate(f,{x:x})

let t=slope+"*(x-"+x+")+"+y
result.innerHTML="Teğet: "+t

config.data=[{fn:f},{fn:t}]
}

if(mode==="distance"){

let x1v=Number(x1.value)
let y1v=Number(y1.value)
let x2v=Number(x2.value)
let y2v=Number(y2.value)

let d=Math.sqrt((x2v-x1v)**2+(y2v-y1v)**2)
result.innerHTML="Mesafe="+d.toFixed(2)

config.data=[{
points:[[x1v,y1v],[x2v,y2v]],
fnType:"points",
graphType:"polyline"
}]
}

currentPlot=functionPlot(config)

setupInteractions()

}catch(e){
result.innerHTML=e.message
}

}

/* ================= INTERACTION ================= */

function setupInteractions(){

plot.onmousemove=function(e){

if(!currentPlot) return

let rect=plot.getBoundingClientRect()

let x=currentPlot.meta.xScale.invert(e.clientX-rect.left)
let y=currentPlot.meta.yScale.invert(e.clientY-rect.top)

coords.innerText=`x: ${x.toFixed(2)} | y: ${y.toFixed(2)}`
}

plot.onclick=function(e){

let rect=plot.getBoundingClientRect()

let x=currentPlot.meta.xScale.invert(e.clientX-rect.left)
let y=currentPlot.meta.yScale.invert(e.clientY-rect.top)

functionPlot({
target:"#plot",
width:plot.clientWidth,
height:400,
grid:true,
zoom:true,
pan:true,
data:[
...currentPlot.options.data,
{
points:[[x,y]],
fnType:"points",
graphType:"scatter",
color:"red"
}
]
})
}

}

/* ================= INTERSECTION ================= */

function findIntersections(){

let f1=func.value
let f2=func2.value

let pts=[]
let rows=""

for(let i=-50;i<=50;i+=0.1){

try{
let y1=math.evaluate(f1,{x:i})
let y2=math.evaluate(f2,{x:i})

if(Math.abs(y1-y2)<0.15){

let x=i.toFixed(2)
let y=y1.toFixed(2)

pts.push([Number(x),Number(y)])

rows+=`<tr>
<td>${x}</td>
<td>${y}</td>
<td>${f1} = ${f2}</td>
</tr>`
}

}catch{}

}

functionPlot({
target:"#plot",
width:plot.clientWidth,
height:400,
grid:true,
zoom:true,
pan:true,
data:[
{fn:f1},
{fn:f2},
{points:pts,fnType:"points",graphType:"scatter",color:"red"}
]
})

tableContainer.innerHTML=`
<h3>Kesişim Tablosu</h3>
<table style="width:100%;border-collapse:collapse;">
<tr style="background:#2563eb;color:white;">
<th>X</th><th>Y</th><th>Durum</th>
</tr>
${rows}
</table>
`

result.innerHTML="Toplam kesişim: "+pts.length

}

/* ================= CALC ================= */

function calc(v){calcDisplay.value+=v}
function calculate(){calcDisplay.value=math.evaluate(calcDisplay.value)}
function clearCalc(){calcDisplay.value=""}

/* ================= PERF ================= */

function debounce(f,d){
let t;return()=>{clearTimeout(t);t=setTimeout(f,d)}
}

func.addEventListener("input",debounce(draw,200))
func2.addEventListener("input",debounce(draw,200))
func3.addEventListener("input",debounce(draw,200))

window.onload=()=>setTimeout(draw,100)

function downloadPNG(){
  const svg = document.querySelector("#plot svg");

  if(!svg){
    alert("Önce grafik çiz!");
    return;
  }

  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svg);

  const img = new Image();
  const svgBlob = new Blob([source], {type:"image/svg+xml;charset=utf-8"});
  const url = URL.createObjectURL(svgBlob);

  img.onload = function(){
    const canvas = document.createElement("canvas");
    canvas.width = svg.clientWidth;
    canvas.height = svg.clientHeight;

    const ctx = canvas.getContext("2d");

    // beyaz arka plan (önemli)
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.drawImage(img,0,0);

    URL.revokeObjectURL(url);

    const link = document.createElement("a");
    link.download = "grafik.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  img.src = url;
}

canvas.width = svg.clientWidth * 2;
canvas.height = svg.clientHeight * 2;
ctx.scale(2,2);
