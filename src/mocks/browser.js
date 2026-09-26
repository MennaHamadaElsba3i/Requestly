import { setupWorker } from 'msw/browser';
import { handlers } from './handlers/requests.handlers';

export const worker = setupWorker(...handlers);
