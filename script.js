/* ================= GLOBAL ================= */

let mode="function"
let currentPlot=null

/* 🔥 FIX: elementleri garanti al */
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
const tableContainer=document.getElementById("tableContainer")
const title=document.getElementById("title")

/* ================= DRAW ================= */

function draw(){

plot.innerHTML=""
result.innerHTML=""
tableContainer.innerHTML=""

let f=func.value

if(!f && mode!=="distance") return

try{

let config={
target:"#plot",
width:plot.clientWidth,
height:400,
grid:true,
data:[]
}

/* 🔹 NORMAL */
if(mode==="function"){
config.data=[{fn:f}]
}

/* 🔹 MULTI */
if(mode==="multi"){

let data=[]
if(f) data.push({fn:f})
if(func2.value) data.push({fn:func2.value})
if(func3.value) data.push({fn:func3.value})

config.data=data
}

/* 🔹 DERIVATIVE */
if(mode==="derivative"){
let d=math.derivative(f,"x").toString()
result.innerHTML="f'(x) = "+d
config.data=[{fn:f},{fn:d}]
}

/* 🔹 INTEGRAL */
if(mode==="integral"){

let aVal=Number(a.value)
let bVal=Number(b.value)

if(isNaN(aVal)||isNaN(bVal)) return

config.data=[
{fn:f},
{fn:f,range:[aVal,bVal],closed:true}
]
}

/* 🔹 TANGENT */
if(mode==="tangent"){

let x=Number(x0.value)
if(isNaN(x)) return

let slope=math.derivative(f,"x").evaluate({x:x})
let y=math.evaluate(f,{x:x})

let t=`${slope}*(x-${x})+${y}`

result.innerHTML="Teğet: "+t

config.data=[{fn:f},{fn:t}]
}

/* 🔹 LIMIT 🔥 EKLENDİ */
if(mode==="limit"){

let x=Number(x0.value)
if(isNaN(x)) return

let val=math.evaluate(f,{x:x})

result.innerHTML="Limit ≈ "+val.toFixed(4)

config.data=[{fn:f}]
}

/* 🔹 DISTANCE */
if(mode==="distance"){

let x1v=Number(x1.value)
let y1v=Number(y1.value)
let x2v=Number(x2.value)
let y2v=Number(y2.value)

if([x1v,y1v,x2v,y2v].some(isNaN)) return

let d=Math.sqrt((x2v-x1v)**2+(y2v-y1v)**2)
result.innerHTML="Mesafe = "+d.toFixed(2)

config.data=[{
points:[[x1v,y1v],[x2v,y2v]],
fnType:"points",
graphType:"polyline"
}]
}

currentPlot=functionPlot(config)

setupInteractions()

}catch(e){
result.innerHTML="Hata: "+e.message
}

}
