import type {Kind,Level,Prompt} from '../types';

const subjects={
 sweet:['最近最开心的一刻','童年最有趣的回忆','一直想培养的爱好','最想重温的一部作品','朋友做过最暖心的事','理想中的周末','最拿手的一道菜','曾经闹过的笑话','最喜欢的旅行地点','今年最期待的事情'],
 flirty:['最心动的一次相遇','最欣赏的性格特质','理想约会的样子','恋爱中最看重的品质','最难忘的一次告白','表达喜欢的方式','对长期关系的期待','最浪漫的电影情节','最容易心动的瞬间','最想和伴侣完成的事'],
 wild:['做过最大胆的决定','不敢轻易承认的怪癖','最突破舒适区的经历','藏得最深的小秘密','最疯狂的一次冲动','最尴尬的私密经历','最反常规的念头','从未告诉朋友的故事','最想彻底忘掉的场面','最出乎意料的欲望']
} satisfies Record<Level,string[]>;
const truthEnds=['是什么？','为什么让你印象深刻？','发生时你有什么感受？','如果重来会改变什么？','你愿意分享其中一个细节吗？','它如何影响了现在的你？','你最想对谁讲起它？','你从中学到了什么？','用三个词会怎样描述？','现在回想起来感觉如何？'];
const dareActs={
 sweet:['模仿一种动物','哼一段熟悉的旋律','用表情演一部电影','讲一个冷笑话','摆出杂志封面姿势','用方言说一句祝福','原地跳一段即兴舞','夸奖在场的一位朋友','表演一次慢动作','分享一张喜欢的照片'],
 flirty:['与自愿的玩家对视十秒','向自愿的玩家真诚夸赞','演绎一次偶像剧相遇','说一句浪漫电影台词','给自愿的玩家设计昵称','描述一次理想约会','隔空送出一个飞吻','用三句话模拟告白','与自愿的玩家合拍爱心手势','为自愿的玩家唱一句情歌'],
 wild:['坦然展示一种独特才艺','讲述一次大胆冒险','表演最夸张的走秀','公开一个无伤大雅的怪癖','演一段反差感角色','接受大家设计的搞怪造型','用戏剧腔朗读聊天记录','模仿自己醉酒后的样子','挑战一分钟不笑','让自愿的玩家为你画脸部彩绘']
} satisfies Record<Level,string[]>;
const dareEnds=['，坚持十秒。','，并让大家打分。','，直到有人猜出来。','，完成后鞠躬谢幕。','，全程保持认真。','，允许大家拍手起哄。','，不能中途笑场。','，加入一个自创动作。','，再邀请一人自愿加入。','，最后说“挑战完成”。'];
const labels:Record<Level,string>={sweet:'纯情档',flirty:'暧昧档',wild:'猎奇档'};
function make(level:Level,kind:Kind):Prompt[]{
 const starts=kind==='truth'?subjects[level]:dareActs[level]; const ends=kind==='truth'?truthEnds:dareEnds;
 return starts.flatMap((start,a)=>ends.map((end,b)=>({id:`${level}-${kind}-${String(a*10+b+1).padStart(3,'0')}`,level,kind,text:kind==='truth'?`${start}${end}`:`${start}${end}`})));
}
export const promptBank:Record<Level,Record<Kind,Prompt[]>> = {
 sweet:{truth:make('sweet','truth'),dare:make('sweet','dare')},flirty:{truth:make('flirty','truth'),dare:make('flirty','dare')},wild:{truth:make('wild','truth'),dare:make('wild','dare')}
};
export {labels};
