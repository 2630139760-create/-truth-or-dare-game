export type Level='sweet'|'flirty'|'wild';
export type Kind='truth'|'dare';
export interface Prompt { id:string; level:Level; kind:Kind; text:string }
