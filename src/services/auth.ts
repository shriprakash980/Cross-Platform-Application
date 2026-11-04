import { Platform } from 'react-native';
import { IAuthService } from './auth.types';

let service: IAuthService;

if (Platform.OS === 'web') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  service = require('./auth.web').authService;
} else {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  service = require('./auth.native').authService;
}

export const authService: IAuthService = service;
export default authService;
