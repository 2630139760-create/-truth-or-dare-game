export const normalize=(angle:number)=>((angle%360)+360)%360;
export function indexAt(angle:number,count:number){const width=360/count;return Math.min(count-1,Math.floor(normalize(angle+width/2)/width));}
export function targetAngle(index:number,count:number,jitter=0){return normalize(index*360/count+jitter);}
export const ease=(u:number)=>3*u*u-2*u*u*u;
export const PLAYER_COLORS=['#ff6b81','#2bb7a9','#ffb020','#6c7ee1','#e05ca8','#48a9e6','#87b943','#f0784f','#8d65c5','#00a88f','#d99119','#e74c6f','#4379d1','#b15ca9','#44964b','#d85e32','#7957a8','#008b92','#bf7c18','#c74368'];
