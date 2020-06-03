import { VideoTrack } from 'twilio-video';

export type RenderDimensionValue =
  | 'low'
  | 'cif'
  | 'vga'
  | 'wvga'
  | '540p'
  | '720p'
  | '960p'
  | 'standard1080p'
  | 'wide1080p'
  | 'default';

export interface RenderDimension {
  label: string;
  value: RenderDimensionValue;
  resolution?: VideoTrack.Dimensions;
}

export const RenderDimensions: RenderDimension[] = [
  {
    label: 'Low (160 x 90)',
    value: 'low',
    resolution: { width: 160, height: 90 },
  },
  {
    label: 'CIF (352 x 288)',
    value: 'cif',
    resolution: { width: 352, height: 288 },
  },
  {
    label: 'VGA (640 x 480)',
    value: 'vga',
    resolution: { width: 640, height: 480 },
  },
  {
    label: 'WVGA (800 x 480)',
    value: 'wvga',
    resolution: { width: 800, height: 480 },
  },
  {
    label: 'HD 540P (960 x 540)',
    value: '540p',
    resolution: { width: 960, height: 540 },
  },
  {
    label: 'HD 720P (1280 x 720)',
    value: '720p',
    resolution: { width: 1280, height: 720 },
  },
  {
    label: 'HD 960P (1280 x 960)',
    value: '960p',
    resolution: { width: 1280, height: 960 },
  },
  {
    label: 'HD Standard 1080P (1440 x 1080)',
    value: 'standard1080p',
    resolution: { width: 1440, height: 1080 },
  },
  {
    label: 'HD Widescreen 1080P (1920 x 1080)',
    value: 'wide1080p',
    resolution: { width: 1920, height: 1080 },
  },
  {
    label: 'Server Default',
    value: 'default',
    resolution: undefined,
  },
];

export function getResolution(value?: RenderDimensionValue) {
  if (typeof value === 'undefined') {
    return undefined;
  }

  return RenderDimensions.find(item => item.value === value)?.resolution;
}
