/* ================= GLOBAL ================= */

let mode="function"
let currentPlot=null

/* ELEMENTLER */
const func=document.getElementById("func")
const func2=document.getElementById("func2")
const func3=document.getElementById("func3")

const a=document.getElementById("a")
const b=document.getElementById("b")
const x0=document.getElementById("x0")

const x1=document.getElementById("x1")
const y1=document.getElementById("y1")
const x2=document.getElementById("x2")
const y2=document.getElementById("y2")

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

func.style.display="inline"

/* 🔥 BUTON AYARI */
let btn=document.getElementById("mainBtn")
btn.innerText="Grafiği Çiz"
btn.style.display="inline-block"

/* MOD */

if(m==="function"){
title.innerText="Fonksiyon"
}

if(m==="multi"){
title.innerText="Çoklu Fonksiyon"
func2.style.display="inline"
func3.style.display="inline"
}

if(m==="distance"){
title.innerText="Mesafe"
x1.style.display="inline"
y1.style.display="inline"
x2.style.display="inline"
y2.style.display="inline"

/* 🔥 BUTON TEXT */
btn.innerText="Sonucu Bul"
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

if(m==="calculator"){
title.innerText="Hesap Makinesi"

document.getElementById("calculator").style.display="block"
plot.style.display="none"

document.getElementById("calcDisplay").style.display="block"
func.style.display="none"

/* 🔥 BUTON GİZLE */
btn.style.display="none"
}

}

/* ================= BUTTON LOGIC ================= */

function handleMainButton(){
if(mode==="distance"){
calcDistance()
}else{
draw()
}
}

/* ================= DRAW ================= */

function draw(){

plot.innerHTML=""
result.innerHTML=""

let f=func.value

if(!f && mode!=="distance") return

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

/* ================= DISTANCE ================= */

function calcDistance(){

let x1v=Number(x1.value)
let y1v=Number(y1.value)
let x2v=Number(x2.value)
let y2v=Number(y2.value)

if([x1v,y1v,x2v,y2v].some(isNaN)) return

let d=Math.sqrt((x2v-x1v)**2+(y2v-y1v)**2)
result.innerHTML="Mesafe = "+d.toFixed(2)

plot.innerHTML=""

functionPlot({
target:"#plot",
width:plot.clientWidth,
height:500,
grid:true,
xAxis:{domain:[-10,10]},
yAxis:{domain:[-10,10]},
data:[
{
points:[[x1v,y1v],[x2v,y2v]],
fnType:"points",
graphType:"scatter"
},
{
points:[[x1v,y1v],[x2v,y2v]],
fnType:"points",
graphType:"polyline"
}
]
})

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

/* ================= UI ================= */

function toggleDark(){
document.body.classList.toggle("dark")
}

/* AUTO */
window.onload=()=>draw()
