/* Pengganti runtime claude.ai: AI -> /api/generate, unduhan -> browser, db -> localStorage (per perangkat). */
(function(){
const J=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}};
function col(name){const key='lkdb_'+name,all=()=>J(key)||{},put=o=>localStorage.setItem(key,JSON.stringify(o));
const mk=f=>({where:(a,op,v)=>mk([...f,[a,op,v]]),
async get(){const o=all(),ids=Object.keys(o).filter(id=>f.every(([a,op,v])=>op==='=='?o[id][a]===v:op==='!='?o[id][a]!==v:true));return{docs:ids.map(id=>({id,data:()=>o[id]})),size:ids.length}},
doc:id=>({id,async get(){const o=all();return{exists:id in o,id,data:()=>o[id]}},async set(d){const o=all();o[id]=d;put(o)},async update(d){const o=all();o[id]={...(o[id]||{}),...d};put(o)},async delete(){const o=all();delete o[id];put(o)}})});return mk([])}
async function sample(prompt,o={}){
const r=await fetch('/api/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt}),signal:o.signal});
if(!r.ok){let m='';try{m=(await r.json()).error}catch(e){}throw{code:r.status===429?'rate_limited':'api_error',message:m||'Server AI error '+r.status}}
const rd=r.body.getReader(),dec=new TextDecoder();let text='';
for(;;){const{done,value}=await rd.read();if(done)break;const d=dec.decode(value,{stream:true});text+=d;o.onText&&o.onText({text:text.replace('\u0000TRUNC',''),delta:d})}
const truncated=text.includes('\u0000TRUNC');return{text:text.replace('\u0000TRUNC',''),truncated}}
const downloads={async save({filename,data}){const a=document.createElement('a');a.href=URL.createObjectURL(data);a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000)}};
window.claude={use:async n=>n==='sample'?sample:n==='downloads'?downloads:n==='db'?{collection:col}:null};
})();
