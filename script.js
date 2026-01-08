let chars = JSON.parse(localStorage.getItem("chars") || "[]");
let current = null;
let mode = "player";

const skillsList = [
  "Luta","Armas Brancas","Armas de Fogo","Esquiva",
  "Conhecimento","Percepção","Investigação","Ocultismo","Intuição",
  "Acrobacia","Atletismo","Furtividade","Resistência",
  "Diplomacia","Persuasão","Enganação","Intimidação","Empatia"
];

function show(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function login(){ show("menu"); }

function openCreate(){
  current = {
    type:"player", vida:15, sanidade:15, incontrole:0,
    aura:null, race:null, skills:{}
  };
  skillsList.forEach(s=>current.skills[s]=0);
  loadEditor();
}

function loadEditor(){
  editorTitle.textContent = "Criar Personagem";
  points.textContent = 200;
  skills.innerHTML="";
  skillsList.forEach(s=>{
    skills.innerHTML += `<label>${s}<input type="number" min="0" value="${current.skills[s]}" onchange="updateSkill('${s}',this.value)"></label>`;
  });
  show("editor");
}

function updateSkill(skill,val){
  val=parseInt(val);
  current.skills[skill]=val;
  let used = Object.values(current.skills).reduce((a,b)=>a+b,0);
  points.textContent = 200-used;
}

function saveCharacter(){
  current.name = charName.value;
  current.player = playerName.value;
  current.appearance = appearance.value;
  current.history = history.value;
  current.ambition = ambition.value;
  chars.push(current);
  localStorage.setItem("chars",JSON.stringify(chars));
  show("menu");
}

function openList(t){
  mode=t;
  listTitle.textContent = t==="npc"?"NPCs":"Personagens";
  listContent.innerHTML="";
  chars.filter(c=>c.type===t).forEach((c,i)=>{
    listContent.innerHTML+=`
      <div>
        <b>${c.name}</b>
        <button onclick="viewChar(${i})">Ver</button>
      </div>`;
  });
  show("list");
}

function viewChar(i){
  current=chars[i];
  viewName.textContent=current.name;
  vida.textContent=current.vida;
  sanidade.textContent=current.sanidade;
  incontrole.textContent=current.incontrole;
  if(current.aura){
    auraBar.classList.remove("hidden");
    aura.textContent=current.aura;
  }
  race.textContent=current.race||"";
  show("view");
}

function modStat(s,v){
  current[s]+=v;
  localStorage.setItem("chars",JSON.stringify(chars));
  viewChar(chars.indexOf(current));
}

function despertar(){
  if(current.race) return;
  let r=Math.floor(Math.random()*100)+1;
  if(r===1){
    current.race="NEPHILIM"; current.vida+=20;
  } else if(r<=10){
    current.race="VIGILANTE"; current.vida+=15;
  } else {
    current.race="AUREADO"; current.vida+=10;
  }
  current.aura=Math.floor(Math.random()*51)+50;
  localStorage.setItem("chars",JSON.stringify(chars));
  viewChar(chars.indexOf(current));
}

function openDice(){
  diceChar.innerHTML="";
  chars.forEach((c,i)=>{
    diceChar.innerHTML+=`<option value="${i}">${c.name}</option>`;
  });
  loadDiceSkills();
  show("dice");
}

function loadDiceSkills(){
  let c=chars[diceChar.value];
  diceSkills.innerHTML="";
  Object.keys(c.skills).forEach(s=>{
    diceSkills.innerHTML+=`<button onclick="roll('${s}',${c.skills[s]})">${s} (${c.skills[s]}%) 🎲</button>`;
  });
}

function roll(skill,val){
  let d=Math.floor(Math.random()*100)+1;
  let res="Fracasso",color="red";
  if(d<=val){
    if(d<=16){res="Sucesso Extremo";color="darkgreen";}
    else if(d<=40){res="Sucesso Bom";color="green";}
    else{res="Sucesso Normal";color="yellow";}
  } else if(d>=90){res="Desastre";color="darkred";}
  diceResult.innerHTML=`<span style="color:${color}">${d} — ${res}</span>`;
}

function back(){ show("menu"); }
