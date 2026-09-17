import {describe,expect,it} from 'vitest';
import {AUTO_SPIN_SECONDS,MAX_SPEED,automaticAngle,forcedPlan,indexAt,normalize,targetAngle} from './engine';
describe('wheel geometry',()=>{
 it('normalizes angles',()=>{expect(normalize(-10)).toBe(350);expect(normalize(370)).toBe(10)});
 it('centres one at noon and proceeds clockwise',()=>{expect(indexAt(0,4)).toBe(0);expect(indexAt(91,4)).toBe(1);expect(indexAt(271,4)).toBe(3)});
 it.each([102,133])('maps first, last, and every center for N=%i',count=>{for(let i=0;i<count;i++)expect(indexAt(targetAngle(i,count),count)).toBe(i);expect(indexAt(targetAngle(count-1,count),count)).toBe(count-1)});
 it('runs at five turns per second across the cruise interval and stops by ten seconds',()=>{expect(automaticAngle(7)-automaticAngle(6)).toBe(MAX_SPEED);expect(AUTO_SPIN_SECONDS).toBe(10);expect(automaticAngle(11)).toBe(automaticAngle(10))});
 it.each([102,133])('plans a 3–5 second redraw that lands on the selected sector for N=%i',count=>{const original=0,target=count-1;const plan=forcedPlan(37,targetAngle(target,count),.42);expect(plan.duration).toBeGreaterThanOrEqual(3);expect(plan.duration).toBeLessThanOrEqual(5);expect(indexAt(37+plan.distance,count)).toBe(target);expect(target).not.toBe(original)});
});
