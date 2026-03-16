```javascript
let mode="function";

function toggleMenu(){
let m=document.getElementById("menu");
m.style.display = m.style.display==="block" ? "none" : "block";
}

function setMode(m){

mode=m;

toggleMenu();

document.getElementById("a").style.display="none";
document.getElementById("b").style.display="none";
document.getElementById("x0").style.display="none";

if(mode==="function"){
document.getElementById("title").innerText="Fonksiyon Grafiği";
}

if(mode==="derivative"){
document.getElementById("title").innerText="Türev Grafiği";
}

if(mode==="integral"){
document.getElementById("title").innerText="İntegral Alanı";
document.getElementById("a").style.display="inline";
document.getElementById("b").style.display="inline";
}

if(mode==="tangent"){
document.getElementById("title").innerText="Teğet Doğrusu";
document.getElementById("x0").style.display="inline";
}

if(mode==="limit"){
document.getElementById("title").innerText="Limit Grafiği";
document.getElementById("x0").style.display="inline";
}

draw();
}

function draw(){

document.getElementById("plot").innerHTML="";

let f=document.getElementById("func").value;

let width=document.getElementById("content").offsetWidth-120;

try{

if(mode==="function"){

functionPlot({
target:"#plot",
width:width,
height:500,
grid:true,
data:[
{fn:f}
]
});

}

if(mode==="derivative"){

let d=math.derivative(f,"x").toString();

functionPlot({
target:"#plot",
width:width,
height:500,
grid:true,
data:[
{fn:d}
]
});

}

if(mode==="integral"){

let a=parseFloat(document.getElementById("a").value);
let b=parseFloat(document.getElementById("b").value);

functionPlot({

target:"#plot",
width:width,
height:500,
grid:true,

data:[
{fn:f,color:"black"},
{fn:f,range:[a,b],closed:true,color:"skyblue"}
]

});

}

if(mode==="tangent"){

let x0=parseFloat(document.getElementById("x0").value);

let f0=math.evaluate(f,{x:x0});
let d=math.derivative(f,"x").toString();
let slope=math.evaluate(d,{x:x0});

let tangent=`${slope}*(x-${x0})+${f0}`;

functionPlot({

target:"#plot",
width:width,
height:500,
grid:true,

data:[
{fn:f,color:"black"},
{fn:tangent,color:"red"},
{points:[[x0,f0]],fnType:"points",color:"red"}
]

});

}

if(mode==="limit"){

let x0=parseFloat(document.getElementById("x0").value);

functionPlot({

target:"#plot",
width:width,
height:500,
grid:true,

data:[
{fn:f,color:"black"},
{fn:`${x0}`,range:[-10,10],color:"red"}
]

});

}

}catch(e){

console.log(e);

}

}

async function askAI(){

let q=document.getElementById("aiInput").value;

document.getElementById("aiAnswer").innerText="AI düşünüyor...";

try{

let response = await fetch(
"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDEUurJTYceMm4vfQU1Ifk9-1frD4Vtg9E"
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
contents:[
{
parts:[
{
text:"Bir matematik öğretmeni gibi adım adım çöz ve neden yaptığını açıkla: "+q
}
]
}
]
})
});

let data = await response.json();

console.log(data);

let ans = data.candidates[0].content.parts[0].text;

document.getElementById("aiAnswer").innerText = ans;

}
catch(e){

document.getElementById("aiAnswer").innerText="AI cevap veremedi.";

console.log(e);

}

}

window.onload=draw;
```
