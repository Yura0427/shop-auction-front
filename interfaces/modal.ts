export interface IModalProps {
  isOpen?: boolean;
  toggle: () => void;
}

export enum EAuthTabs {
  fastOrder,
  login,
  register,
}
