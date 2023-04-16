import io from 'socket.io-client';

export const socket = io(process.env.NEXT_PUBLIC_REACT_APP_ROOT || 'http://localhost:4000', {
  autoConnect: false,
});
