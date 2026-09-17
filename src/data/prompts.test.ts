import {describe,expect,it} from 'vitest';
import source from './game-question-bank.json';
import {CONTENT_VERSION,promptBank} from './prompts';

describe('prompt bank',()=>{
 it('loads all 635 questions from the only approved groups',()=>{
  const expected=[[promptBank.sweet.truth,100],[promptBank.sweet.dare,100],[promptBank.flirty.truth,100],[promptBank.flirty.dare,100],[promptBank.wild.truth,133],[promptBank.wild.dare,102]] as const;
  for(const [list,count] of expected) expect(list).toHaveLength(count);
  const actual=expected.flatMap(([list])=>list);
  const approved=source.groups.flatMap(group=>group.questions);
  expect(actual).toHaveLength(635);
  expect(new Set(actual.map(x=>x.id)).size).toBe(635);
  expect(actual.map(x=>[x.id,x.text])).toEqual(approved.map(x=>[x.id,x.text]));
  expect(CONTENT_VERSION).toBe('user-bank-2026-09-17-v2');
 });
});
