import { setupServer } from 'msw/node';
import { handlers } from './handlers/requests.handlers';

export const server = setupServer(...handlers);
