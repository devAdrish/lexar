type allAnyTypes = any | undefined | null;

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
}

interface Message {
  from: string;
  message: string,
  time?: Date | string;
  failed?: boolean;
}