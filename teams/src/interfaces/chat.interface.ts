export enum SenderType {
  self = 0,
  frnd = 1,
}

export interface Chat {
  content: string;
  time: string;
  sender: SenderType;
}
