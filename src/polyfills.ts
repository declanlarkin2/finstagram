import 'zone.js';
(window as any).global = window;
global.Buffer = global.Buffer || require('buffer').Buffer;
(window as any).process = {
  version: '',
};
import 'util';
