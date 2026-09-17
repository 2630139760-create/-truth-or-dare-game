import{useCallback,useEffect,useRef,useState}from'react';
import{Expand,Minimize,Heart,Sparkles}from'lucide-react';
import{AUTO_SPIN_SECONDS,MAX_SPEED,RAMP_SECONDS,ease,forcedPlan,indexAt,PLAYER_COLORS,targetAngle}from'./engine';
import{CONTENT_VERSION,labels,promptBank}from'./data/prompts';
import type{Kind,Level,Prompt}from'./types';

type Page='home'|'level'|'players'|'playerWheel'|'kind'|'promptWheel'|'result'|'final';
interface Game{contentVersion:string;page:Page;level?:Level;players:number;playerAngle:number;truthAngle:number;dareAngle:number;player?:number;kind?:Kind;prompt?:Prompt;first?:Prompt}
const fresh:Game={contentVersion:CONTENT_VERSION,page:'home',players:4,playerAngle:0,truthAngle:0,dareAngle:0};
function loadGame(){
 try{
  const raw=sessionStorage.getItem('tod-game');
  if(!raw)return{game:fresh,migrated:false};
  const saved=JSON.parse(raw) as Game;
  if(saved.contentVersion!==CONTENT_VERSION){sessionStorage.removeItem('tod-game');localStorage.removeItem('tod-game');return{game:fresh,migrated:true}}
  return{game:{...fresh,...saved},migrated:false};
 }catch{sessionStorage.removeItem('tod-game');return{game:fresh,migrated:true}}
}

function Wheel({count,angle,labels:items,colors}:{count:number;angle:number;labels:string[];colors:string[]}){
 const size=500,c=size/2,r=238,inner=r*.42,outer=r*.94;
 return <svg className="wheel" viewBox={`0 0 ${size} ${size}`} aria-label={`${count}格转盘`}>
  <defs>{Array.from({length:count},(_,i)=>{const w=360/count,a0=(i*w-w/2-90)*Math.PI/180,a1=(i*w+w/2-90)*Math.PI/180;return <clipPath id={`sector-${count}-${i}`} key={i}><path d={`M${c},${c} L${c+r*Math.cos(a0)},${c+r*Math.sin(a0)} A${r},${r} 0 ${w>180?1:0} 1 ${c+r*Math.cos(a1)},${c+r*Math.sin(a1)} Z`}/></clipPath>})}</defs>
  <g>{Array.from({length:count},(_,i)=>{const w=360/count,a0=(i*w-w/2-90)*Math.PI/180,a1=(i*w+w/2-90)*Math.PI/180;const path=`M${c},${c} L${c+r*Math.cos(a0)},${c+r*Math.sin(a0)} A${r},${r} 0 ${w>180?1:0} 1 ${c+r*Math.cos(a1)},${c+r*Math.sin(a1)} Z`;const mid=(i*w-90)*Math.PI/180;const isPlayer=count<=20;const font=isPlayer?Math.max(18,42-count):Math.max(2.2,Math.min(5.2,2*Math.PI*outer/count*.48));return <g key={i}><path d={path} fill={colors[i%colors.length]} stroke="#fff" strokeWidth={isPlayer?2:.45}/>{isPlayer?<text x={c+r*.72*Math.cos(mid)} y={c+r*.72*Math.sin(mid)} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontWeight="900" fontSize={font} transform={`rotate(${i*w},${c+r*.72*Math.cos(mid)},${c+r*.72*Math.sin(mid)})`}>{items[i]}</text>:<text className="prompt-label" x={c+inner} y={c} dominantBaseline="middle" fontSize={font} textLength={outer-inner} lengthAdjust="spacingAndGlyphs" clipPath={`url(#sector-${count}-${i})`} transform={`rotate(${i*w-90} ${c} ${c})`}>{items[i]}</text>}</g>})}</g>
  <g className="pointer" transform={`rotate(${angle} ${c} ${c})`}><line x1={c} y1={c} x2={c} y2="25"/><path d="M250 12l-7 24h14z"/></g><circle cx={c} cy={c} r="22" fill="#fff" stroke="#202334" strokeWidth="7"/>
 </svg>
}

function App(){
 const loaded=useRef(loadGame());const[g,setG]=useState<Game>(loaded.current.game);const[spinning,setSpinning]=useState(false);const[exit,setExit]=useState(false);const[notice,setNotice]=useState(loaded.current.migrated);const[error,setError]=useState('');const[full,setFull]=useState(!!document.fullscreenElement);const raf=useRef(0);const stop=useRef<(()=>void)|null>(null);
 useEffect(()=>{sessionStorage.setItem('tod-game',JSON.stringify(g))},[g]);
 useEffect(()=>{const f=()=>setFull(!!document.fullscreenElement);document.addEventListener('fullscreenchange',f);return()=>document.removeEventListener('fullscreenchange',f)},[]);
 useEffect(()=>()=>cancelAnimationFrame(raf.current),[]);
 const patch=(v:Partial<Game>)=>setG(x=>({...x,...v}));
 const angleKey=g.page==='playerWheel'?'playerAngle':g.kind==='truth'?'truthAngle':'dareAngle';
 const spin=useCallback((forced=false)=>{
  if(spinning)return;
  const count=g.page==='playerWheel'?g.players:promptBank[g.level!]?.[g.kind!]?.length??0;
  if(count<1)return;
  setSpinning(true);const start=performance.now(),initial=g[angleKey] as number;let last=start,total=initial,decelStart:number|null=null,decelFrom=0;
  let forcedDuration=0,forcedDistance=0;
  if(forced){const excluded=g.first?.id;const list=promptBank[g.level!][g.kind!];const choices=list.map((_,i)=>i).filter(i=>list[i].id!==excluded);if(!choices.length){setSpinning(false);return}const chosen=choices[Math.floor(Math.random()*choices.length)];const jitter=(Math.random()-.5)*(360/count*.7);const plan=forcedPlan(initial,targetAngle(chosen,count,jitter),Math.random());forcedDuration=plan.duration;forcedDistance=plan.distance}
  stop.current=()=>{if(!forced&&decelStart===null){const now=performance.now();const elapsed=(now-start)/1000;decelFrom=elapsed<RAMP_SECONDS?MAX_SPEED*ease(elapsed/RAMP_SECONDS):MAX_SPEED;decelStart=now}};
  const tick=(now:number)=>{const elapsed=(now-start)/1000,dt=Math.min(.05,(now-last)/1000);last=now;let done=false;
   if(forced){const duration=forcedDuration;const t=Math.min(elapsed,duration);const unitDistance=MAX_SPEED*(duration-RAMP_SECONDS);let distance;if(t<RAMP_SECONDS)distance=MAX_SPEED*RAMP_SECONDS*(Math.pow(t/RAMP_SECONDS,3)-.5*Math.pow(t/RAMP_SECONDS,4));else if(t<=duration-RAMP_SECONDS)distance=MAX_SPEED*(t-RAMP_SECONDS/2);else{const down=t-(duration-RAMP_SECONDS),u=down/RAMP_SECONDS;distance=MAX_SPEED*(duration-1.5*RAMP_SECONDS)+MAX_SPEED*(down-RAMP_SECONDS*(u*u*u-.5*u*u*u*u))}total=initial+distance*(forcedDistance/unitDistance);done=elapsed>=duration;
   }else{if(decelStart===null&&elapsed>=AUTO_SPIN_SECONDS-RAMP_SECONDS){decelStart=start+(AUTO_SPIN_SECONDS-RAMP_SECONDS)*1000;decelFrom=MAX_SPEED}let speed;if(decelStart!==null){const down=(now-decelStart)/1000;speed=decelFrom*(1-ease(down/RAMP_SECONDS));done=down>=RAMP_SECONDS}else speed=MAX_SPEED*ease(elapsed/RAMP_SECONDS);if(!done)total+=speed*dt}
   patch({[angleKey]:total});
   if(!done){raf.current=requestAnimationFrame(tick);return}
   setSpinning(false);stop.current=null;const final=forced?initial+forcedDistance:total;patch({[angleKey]:final});
   if(g.page==='playerWheel'){const player=indexAt(final,count)+1;setTimeout(()=>patch({page:'kind',player}),2000)}else{const list=promptBank[g.level!][g.kind!];const item=list[indexAt(final,list.length)];setTimeout(()=>patch({page:forced?'final':'result',prompt:item}),forced?2000:0)}
  };raf.current=requestAnimationFrame(tick)
 },[spinning,g,angleKey]);
 const quit=()=>{cancelAnimationFrame(raf.current);sessionStorage.removeItem('tod-game');setG(fresh);setSpinning(false);setExit(false)};
 const inGame=g.page!=='home';const prompts=g.level&&g.kind?promptBank[g.level][g.kind]:[];const angle=g[angleKey] as number;
 const sideButton=(side:'left'|'right')=><button className={`side ${side} ${spinning?'pause':''}`} onClick={()=>spinning?stop.current?.():spin()}><span>{spinning?'暂停':'开始'}</span></button>;
 return <main className={`app page-${g.page}`}><button className="fullscreen" aria-label="切换全屏" onClick={()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()}>{full?<Minimize/>:<Expand/>}</button>{inGame&&<button className="exit" aria-label="退出游戏" onClick={()=>setExit(true)}>×</button>}
 {g.page==='home'&&<section className="hero"><span className="sticker one">今晚不许躲</span><Heart className="heart"/><Sparkles className="spark"/><p className="eyebrow">PARTY GAME</p><h1>真心话<br/><b>大冒险</b></h1><p>转动指针，让今晚多一点心跳。</p><button className="primary" onClick={()=>patch({page:'level'})}>开始游戏 <span>→</span></button></section>}
 {g.page==='level'&&<section className="panel"><p className="eyebrow">CHOOSE YOUR VIBE</p><h2>今晚，想玩到哪一步？</h2><div className="levels">{(['sweet','flirty','wild']as Level[]).map((x,i)=><button key={x} className={`level l${i}`} onClick={()=>patch({level:x,page:'players'})}><b>{['🌱','💗','🔥'][i]} {labels[x]}</b><span>{['轻松有趣，笑声刚刚好','心跳升温，距离近一点','大胆刺激，也要尊重边界'][i]}</span><i>选择此档 →</i></button>)}</div><p className="consent">所有互动须经对方同意；任何人都可以拒绝或随时停止。</p></section>}
 {g.page==='players'&&<section className="panel players"><p className="eyebrow">{g.level&&labels[g.level]} · HOW MANY PLAYERS?</p><h2>有多少位冒险家？</h2><p>输入 2—20 人，我们会为每个人分配专属颜色。</p><form onSubmit={e=>{e.preventDefault();if(!Number.isInteger(g.players)||g.players<2||g.players>20){setError('请输入 2—20 之间的整数');return}setError('');patch({page:'playerWheel'})}}><button type="button" onClick={()=>patch({players:Math.max(2,g.players-1)})}>−</button><input aria-label="玩家人数" type="number" value={g.players} onChange={e=>patch({players:Number(e.target.value)})}/><button type="button" onClick={()=>patch({players:Math.min(20,g.players+1)})}>＋</button><button className="primary" type="submit">准备好了 →</button></form>{error&&<p className="error">{error}</p>}</section>}
 {(g.page==='playerWheel'||g.page==='promptWheel')&&<section className="wheelpage"><header><p className="eyebrow">{g.level&&labels[g.level]} · {g.page==='playerWheel'?'WHO’S NEXT?':g.kind==='truth'?'TRUTH TIME':'DARE TIME'}</p><h2>{g.page==='playerWheel'?'转动指针，选出下一位':g.kind==='truth'?'真心话时间':'大冒险时间'}</h2><p>{spinning?'指针正在寻找命运…':'点击任一侧按钮开始'}</p></header><div className="wheelrow">{!g.first&&sideButton('left')}<Wheel count={g.page==='playerWheel'?g.players:prompts.length} angle={angle} labels={g.page==='playerWheel'?Array.from({length:g.players},(_,i)=>String(i+1)):prompts.map(x=>x.text)} colors={g.page==='playerWheel'?PLAYER_COLORS:['#f7a8b8','#7ed6d0','#f7ca6b','#9fa8e8','#dda0cf']}/>{!g.first&&sideButton('right')}</div></section>}
 {g.page==='kind'&&<><section className="wheelpage dim"><Wheel count={g.players} angle={g.playerAngle} labels={Array.from({length:g.players},(_,i)=>String(i+1))} colors={PLAYER_COLORS}/></section><div className="shade"><section className="modal choose"><h2><em style={{color:PLAYER_COLORS[(g.player!-1)%20]}}>{g.player}号</em> 请你选择：</h2><div><button onClick={()=>patch({kind:'truth',page:'promptWheel'})}>真心话<span>说出秘密</span></button><button onClick={()=>patch({kind:'dare',page:'promptWheel'})}>大冒险<span>接受挑战</span></button></div></section></div></>}
 {g.page==='result'&&<div className="shade"><section className="modal result"><p className="eyebrow">YOUR CHALLENGE</p><h2>{g.prompt?.text}</h2><div><button className="done" onClick={()=>patch({page:'playerWheel',player:undefined,kind:undefined,prompt:undefined,first:undefined})}>完成</button><button className="red" onClick={()=>{patch({page:'promptWheel',first:g.prompt});setTimeout(()=>spin(true),0)}}>重抽</button></div><small>重抽只有一次机会；互动仍须同意，可以拒绝或停止</small></section></div>}
 {g.page==='final'&&<section className="final"><p>最终挑战</p><h2>{g.prompt?.text}</h2><button className="done" onClick={()=>patch({page:'playerWheel',player:undefined,kind:undefined,prompt:undefined,first:undefined})}>已完成</button></section>}
 {notice&&<div className="shade top"><section className="modal confirm"><h2>题库已更新</h2><p>旧会话与新版题库不兼容，已为你重新开局。</p><button className="done" onClick={()=>setNotice(false)}>知道了</button></section></div>}
 {exit&&<div className="shade top"><section className="modal confirm"><h2>是否退出</h2><div><button onClick={quit}>确定</button><button onClick={()=>setExit(false)}>取消</button></div></section></div>}</main>
}
export default App;
