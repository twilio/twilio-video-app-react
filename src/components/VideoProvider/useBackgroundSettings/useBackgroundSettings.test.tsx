import { renderHook, act } from '@testing-library/react-hooks';
import { EventEmitter } from 'events';
import { Room } from 'twilio-video';
import useBackgroundSettings from './useBackgroundSettings';

describe('The useBackgroundSettings hook ', () => {
  let mockRoom: any = new EventEmitter();

  it('should reset the background settings after disconnect.', () => {});
});
