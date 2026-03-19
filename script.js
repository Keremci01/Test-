/* ================= GLOBAL ================= */

let mode="function"

/* ELEMENTLER */
const func=document.getElementById("func")
const func2=document.getElementById("func2")
const func3=document.getElementById("func3")

const a=document.getElementById("a")
const b=document.getElementById("b")
const x0=document.getElementById("x0")

const plot=document.getElementById("plot")
const result=document.getElementById("result")
const title=document.getElementById("title")

/* ================= MENU ================= */

function toggleMenu(){
document.getElementById("menu").classList.toggle("active")
}

function toggleGroup(id){
let el = document.getElementById(id)
el.style.display = (el.style.display==="block") ? "none" : "block"
}

/* ================= MODE ================= */

function setMode(m){

mode=m

document.querySelectorAll("input").forEach(i=>{
if(i.id!=="calcDisplay"){
i.style.display="none"
}
})

document.getElementById("calculator").style.display="none"
plot.style.display="block"

func.style.display="none"

let btn=document.getElementById("mainBtn")
btn.innerText="Grafiği Çiz"
btn.style.display="inline-block"

if(m==="function"){
title.innerText="Fonksiyon"
func.style.display="inline"
}

if(m==="multi"){
title.innerText="Çoklu Fonksiyon"
func.style.display="inline"
func2.style.display="inline"
func3.style.display="inline"
}

if(m==="derivative"){
title.innerText="Türev"
func.style.display="inline"
}

if(m==="integral"){
title.innerText="İntegral"
func.style.display="inline"
a.style.display="inline"
b.style.display="inline"
}

if(m==="tangent"){
title.innerText="Teğet"
func.style.display="inline"
x0.style.display="inline"
}

if(m==="limit"){
title.innerText="Limit"
func.style.display="inline"
x0.style.display="inline"
}

if(m==="calculator"){
title.innerText="Hesap Makinesi"

document.getElementById("calculator").style.display="block"
plot.style.display="none"

document.getElementById("calcDisplay").style.display="block"

btn.style.display="none"
}

}

/* ================= DRAW ================= */

function handleMainButton(){
draw()
}

function draw(){

plot.innerHTML=""
result.innerHTML=""

let f=func.value
if(!f) return

let data=[]

try{

if(mode==="function"){
data=[{fn:f}]
}

if(mode==="multi"){
if(f) data.push({fn:f})
if(func2.value) data.push({fn:func2.value})
if(func3.value) data.push({fn:func3.value})
}

if(mode==="derivative"){
let d=math.derivative(f,"x").toString()
result.innerHTML="f'(x)="+d
data=[{fn:f},{fn:d}]
}

if(mode==="integral"){
let aVal=Number(a.value)
let bVal=Number(b.value)
if(isNaN(aVal)||isNaN(bVal)) return

data=[
{fn:f},
{fn:f,range:[aVal,bVal],closed:true}
]
}

if(mode==="tangent"){
let x=Number(x0.value)
if(isNaN(x)) return

let slope=math.derivative(f,"x").evaluate({x:x})
let y=math.evaluate(f,{x:x})

let t=`${slope}*(x-${x})+${y}`
result.innerHTML="Teğet: "+t

data=[{fn:f},{fn:t}]
}

if(mode==="limit"){
let x=Number(x0.value)
if(isNaN(x)) return

let val=math.evaluate(f,{x:x})
result.innerHTML="Limit ≈ "+val.toFixed(4)

data=[{fn:f}]
}

functionPlot({
target:"#plot",
width:plot.clientWidth,
height:500,
grid:true,
data:data
})

}catch(e){
result.innerHTML="Hata: "+e.message
}

}

/* ================= PNG DOWNLOAD ================= */

function downloadPNG(){
let svg = document.querySelector("#plot svg")
let serializer = new XMLSerializer()
let source = serializer.serializeToString(svg)

let img = new Image()
img.src = "data:image/svg+xml;base64," + btoa(source)

let canvas = document.createElement("canvas")
canvas.width = 800
canvas.height = 500

let ctx = canvas.getContext("2d")

img.onload = function(){
ctx.drawImage(img,0,0)

let a = document.createElement("a")
a.download = "grafik.png"
a.href = canvas.toDataURL("image/png")
a.click()
}
}

/* ================= CALC ================= */

function calc(v){
document.getElementById("calcDisplay").value+=v
}

function calculate(){
try{
let exp=document.getElementById("calcDisplay").value
.replace(/÷/g,"/")
.replace(/×/g,"*")
.replace(/−/g,"-")

document.getElementById("calcDisplay").value=math.evaluate(exp)
}catch{
alert("Hatalı işlem")
}
}

function clearCalc(){
document.getElementById("calcDisplay").value=""
}

/* ================= DARK MODE ================= */

function toggleDark(){
document.body.classList.toggle("dark")
}

/* AUTO */
window.onload=()=>draw()
