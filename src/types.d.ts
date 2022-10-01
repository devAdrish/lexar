type allAnyTypes = any | undefined | null;

declare module "*.png"

interface RaiseToastFnArgs {
  message: string;
  type: string;
  duration?: number;
}

interface FriendInfo {
  name: string;
  email: string;
  isOnline: boolean;
  photo: string;
  about: string;
  newUnreadMessage?: string;
}

interface Message {
  from: string;
  message: string,
  time?: Date | string;
  failed?: boolean;
}