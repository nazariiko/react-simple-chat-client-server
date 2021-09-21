import io from 'socket.io-client';
import { ENDPOINT } from './api'

const socket = io(ENDPOINT);

export default socket;