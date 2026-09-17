export const MAX_SPEED=1800;
export const RAMP_SECONDS=1;
export const AUTO_SPIN_SECONDS=10;
export const normalize=(angle:number)=>((angle%360)+360)%360;
export function indexAt(angle:number,count:number){
 if(count<=0)return -1;
 const width=360/count;
 return Math.min(count-1,Math.floor(normalize(angle+width/2)/width));
}
export function targetAngle(index:number,count:number,jitter=0){return count>0?normalize(index*360/count+jitter):0;}
export const ease=(u:number)=>{const x=Math.max(0,Math.min(1,u));return 3*x*x-2*x*x*x};
/** Exact integral of smoothstep from zero to u. */
export const easeIntegral=(u:number)=>{const x=Math.max(0,Math.min(1,u));return x*x*x-.5*x*x*x*x};
export function automaticAngle(elapsed:number,duration=AUTO_SPIN_SECONDS){
 const t=Math.max(0,Math.min(duration,elapsed));
 if(t<RAMP_SECONDS)return MAX_SPEED*RAMP_SECONDS*easeIntegral(t/RAMP_SECONDS);
 if(t<=duration-RAMP_SECONDS)return MAX_SPEED*(t-RAMP_SECONDS/2);
 const down=t-(duration-RAMP_SECONDS);
 return MAX_SPEED*(duration-1.5*RAMP_SECONDS)+MAX_SPEED*(down-RAMP_SECONDS*easeIntegral(down/RAMP_SECONDS));
}
export function forcedPlan(initial:number,target:number,random=Math.random()){
 const base=normalize(target-initial);
 const minTurns=Math.ceil((MAX_SPEED*(3-RAMP_SECONDS)-base)/360);
 const maxTurns=Math.floor((MAX_SPEED*(5-RAMP_SECONDS)-base)/360);
 const turns=minTurns+Math.floor(random*Math.max(1,maxTurns-minTurns+1));
 const distance=base+turns*360;
 return {distance,duration:distance/MAX_SPEED+RAMP_SECONDS};
}
export function forcedAngle(elapsed:number,duration:number){return automaticAngle(elapsed,duration);}
export const PLAYER_COLORS=['#ff6b81','#2bb7a9','#ffb020','#6c7ee1','#e05ca8','#48a9e6','#87b943','#f0784f','#8d65c5','#00a88f','#d99119','#e74c6f','#4379d1','#b15ca9','#44964b','#d85e32','#7957a8','#008b92','#bf7c18','#c74368'];
