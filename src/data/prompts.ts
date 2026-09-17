import source from './game-question-bank.json';
import type {Kind,Level,Prompt} from '../types';

const levelMap={innocent:'sweet',flirty:'flirty',extreme:'wild'} as const;
const kindMap={truth:'truth',dare:'dare'} as const;
export const CONTENT_VERSION=source.contentVersion;
export const labels:Record<Level,string>={sweet:'休闲档',flirty:'暧昧档',wild:'刺激档'};

const empty=():Record<Kind,Prompt[]>=>({truth:[],dare:[]});
export const promptBank:Record<Level,Record<Kind,Prompt[]>>={sweet:empty(),flirty:empty(),wild:empty()};
for(const group of source.groups){
 const level=levelMap[group.level as keyof typeof levelMap];
 const kind=kindMap[group.type as keyof typeof kindMap];
 if(!level||!kind) continue;
 promptBank[level][kind]=group.questions.map(question=>({
  id:question.id,
  level,
  kind,
  text:question.text,
 }));
}
