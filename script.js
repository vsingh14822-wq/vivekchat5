let contacts = JSON.parse(localStorage.getItem("contacts")) || [
{name:"Vivek",phone:"7078183717",status:"online"},
{name:"Ramkishan",phone:"9452121330",status:"last seen recently"}
];

let chats = JSON.parse(localStorage.getItem("chats")) || {};
let statuses = JSON.parse(localStorage.getItem("statuses")) || [];

let currentUser="";

/* SAVE */
function save(){
localStorage.setItem("contacts",JSON.stringify(contacts));
localStorage.setItem("chats",JSON.stringify(chats));
localStorage.setItem("statuses",JSON.stringify(statuses));
}

/* INIT */
function init(){
loadChats();
loadContacts();
loadStatus();
}

/* NAV */
function switchScreen(id){
document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
document.getElementById(id).classList.add("active");
}

/* CONTACTS */
function loadContacts(){
contactList.innerHTML="";
contacts.forEach(c=>{
if(!chats[c.name]) chats[c.name]=[];

contactList.innerHTML+=`
<div class="contact">
<div onclick="openChat('${c.name}')">
<h4>${c.name}</h4>
<p>${c.phone}</p>
</div>
<button onclick="deleteContact('${c.name}')">❌</button>
</div>`;
});
}

/* DELETE CONTACT */
function deleteContact(name){
contacts=contacts.filter(c=>c.name!==name);
delete chats[name];
save();
init();
}

/* CHATS */
function loadChats(){
chatsDiv=document.getElementById("chats");
chatsDiv.innerHTML="";
contacts.forEach(c=>{
chatsDiv.innerHTML+=`
<div class="chat" onclick="openChat('${c.name}')">
<h4>${c.name}</h4>
<p>${c.phone}</p>
</div>`;
});
}

/* ADD CONTACT */
function addContact(){
let n=newName.value.trim();
let p=newPhone.value.trim();
if(!n||!p)return;
contacts.push({name:n,phone:p,status:"offline"});
chats[n]=[];
save();init();
}

/* CHAT */
function openChat(name){
currentUser=name;
let u=contacts.find(x=>x.name===name);
chatName.innerText=`${u.name} (${u.phone}) - ${u.status}`;
chatWindow.classList.add("active");
loadMessages();
}
function closeChat(){chatWindow.classList.remove("active");}

/* SEND */
function sendMessage(){
let t=messageInput.value.trim();
if(!t)return;
chats[currentUser].push({text:t,type:"sent"});
messageInput.value="";
save();loadMessages();
reply();
}

/* REPLY */
function reply(){
let arr=[
"Hey 👋","Kaise ho 😄","Main theek hoon",
"Kya kar rahe ho?","Nice 👍","Wah 🔥",
"Zabardast 💯","Aur batao 😄"
];
let r=arr[Math.floor(Math.random()*arr.length)];

setTimeout(()=>{
chats[currentUser].push({text:r,type:"received"});
save();loadMessages();
},1000);
}

/* DELETE MSG */
function deleteMessage(i){
chats[currentUser].splice(i,1);
save();loadMessages();
}
function deleteAllChat(){
chats[currentUser]=[];
save();loadMessages();
}

/* FILE */
function sendFile(e){
let f=e.target.files[0];
if(!f)return;
let url=URL.createObjectURL(f);
chats[currentUser].push({type:"sent",url});
save();loadMessages();
}

/* VOICE */
let rec,chunks=[];
async function startRecording(){
let s=await navigator.mediaDevices.getUserMedia({audio:true});
rec=new MediaRecorder(s);
rec.start();
rec.ondataavailable=e=>chunks.push(e.data);
rec.onstop=()=>{
let blob=new Blob(chunks);
let url=URL.createObjectURL(blob);
chats[currentUser].push({type:"sent",audio:url});
save();loadMessages();
chunks=[];
};
}

/* VIDEO */
let stream;
async function startVideoCall(){
try{
stream=await navigator.mediaDevices.getUserMedia({video:true});
let v=document.createElement("video");
v.autoplay=true;v.srcObject=stream;
v.style="width:100%;height:100%";
document.body.appendChild(v);
}catch{}
}

/* CALL */
function makeCall(){
alert("📞 Calling "+currentUser);
}

/* MESSAGES */
function loadMessages(){
messages.innerHTML="";
chats[currentUser].forEach((m,i)=>{
let d=document.createElement("div");
d.className="message "+m.type;
if(m.text)d.innerText=m.text;

let del=document.createElement("span");
del.innerText=" ❌";
del.onclick=()=>deleteMessage(i);
d.appendChild(del);

messages.appendChild(d);
});
messages.scrollTop=messages.scrollHeight;
}

/* STATUS */
function addStatus(){
let t=statusInput.value.trim();
if(!t)return;
statuses.push(t);
save();loadStatus();
}
function loadStatus(){
statusList.innerHTML="";
statuses.forEach(s=>{
statusList.innerHTML+=`<div>${s}</div>`;
});
}

/* START */
init();