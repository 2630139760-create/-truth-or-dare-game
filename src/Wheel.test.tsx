import {cleanup,render} from '@testing-library/react';
import {afterEach,describe,expect,it} from 'vitest';
import {Wheel} from './App';
import {promptBank} from './data/prompts';

const COLORS=['#f7a8b8','#7ed6d0','#f7ca6b'];
const groups=[
 ['休闲档真心话',promptBank.sweet.truth,100],
 ['休闲档大冒险',promptBank.sweet.dare,100],
 ['暧昧档真心话',promptBank.flirty.truth,100],
 ['暧昧档大冒险',promptBank.flirty.dare,100],
 ['刺激档真心话',promptBank.wild.truth,133],
 ['刺激档大冒险',promptBank.wild.dare,102],
] as const;

afterEach(cleanup);

describe('prompt wheel labels',()=>{
 it.each(groups)('%s renders every prompt in its own unclipped SVG',(_name,prompts,count)=>{
  const {container}=render(<Wheel count={prompts.length} angle={0} labels={prompts.map(prompt=>prompt.text)} colors={COLORS}/>);
  const labels=[...container.querySelectorAll<SVGSVGElement>('svg.prompt-label-svg')];
  expect(labels).toHaveLength(count);
  expect(container.querySelector('clipPath')).toBeNull();
  expect(labels.every(label=>label.querySelectorAll('text').length===1)).toBe(true);
  expect(labels.map(label=>label.textContent)).toEqual(prompts.map(prompt=>prompt.text));
 });

 it.each(groups)('%s covers all eight 45-degree directions',(_name,prompts)=>{
  const {container}=render(<Wheel count={prompts.length} angle={0} labels={prompts.map(prompt=>prompt.text)} colors={COLORS}/>);
  const angles=[...container.querySelectorAll<SVGSVGElement>('svg.prompt-label-svg')].map(label=>Number(label.dataset.promptAngle));
  for(const target of [0,45,90,135,180,225,270,315]){
   const distance=Math.min(...angles.map(angle=>Math.abs(((angle-target+540)%360)-180)));
   expect(distance).toBeLessThanOrEqual(180/prompts.length);
  }
 });

 it('uses one normalized rotation after translating each label to the wheel center',()=>{
  const prompts=promptBank.wild.truth;
  const {container}=render(<Wheel count={prompts.length} angle={0} labels={prompts.map(prompt=>prompt.text)} colors={COLORS}/>);
  for(const label of container.querySelectorAll<SVGSVGElement>('svg.prompt-label-svg')){
   const angle=Number(label.dataset.promptAngle);
   expect(angle).toBeGreaterThanOrEqual(0);
   expect(angle).toBeLessThan(360);
   expect(label.querySelector('g')).toHaveAttribute('transform',`translate(250 250) rotate(${angle})`);
   const text=label.querySelector('text')!;
   expect(Number(text.getAttribute('x'))/238).toBeCloseTo(.48);
   expect((Number(text.getAttribute('x'))+Number(text.getAttribute('textLength')))/238).toBeCloseTo(.9);
  }
 });
});
