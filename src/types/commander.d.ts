import type { FigActConfig } from '../types';

declare module 'commander' {
  interface Command {
    config?: FigActConfig;
  }
}
