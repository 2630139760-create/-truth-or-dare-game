import {fireEvent,render,screen} from '@testing-library/react';
import {beforeEach,describe,expect,it} from 'vitest';
import App from './App';

describe('game setup',()=>{
 beforeEach(()=>sessionStorage.clear());
 it('moves from home through level and player selection',()=>{
  render(<App/>);
  fireEvent.click(screen.getByRole('button',{name:/开始游戏/}));
  fireEvent.click(screen.getByRole('button',{name:/休闲档/}));
  const input=screen.getByLabelText('玩家人数');
  fireEvent.change(input,{target:{value:'6'}});
  fireEvent.click(screen.getByRole('button',{name:/准备好了/}));
  expect(screen.getByText('转动指针，选出下一位')).toBeInTheDocument();
  expect(screen.getByLabelText('6格转盘')).toBeInTheDocument();
 });
});
