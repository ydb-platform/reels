import {Node, Path} from '@motion-canvas/2d/lib/components';
import type {NodeProps} from '@motion-canvas/2d/lib/components';
import type {IconMeta} from './types';

/**
 * DiskIcon — stylized disk glyph used for storage/rack visuals.
 *
 * Usage:
 * - Place in racks or topology diagrams; animate via Node signals (x, y, scale, opacity).
 */
export default function DiskIcon(props: NodeProps) {
  return (
    <Node {...props}>
      <Path
        data="M0.691527 13.2189L2.71124 2.44713C2.97728 1.02822 4.21621 0 5.65985 0H18.3401C19.7838 0 21.0227 1.02822 21.2888 2.44713L23.3085 13.2189C22.8985 13.0771 22.4582 13 22 13H2C1.54176 13 1.10152 13.0771 0.691527 13.2189zM2 15H22C23.1046 15 24 15.8954 24 17V19C24 20.1046 23.1046 21 22 21H2C0.89543 21 0 20.1046 0 19V17C0 15.8954 0.89543 15 2 15zM21 19C21.5523 19 22 18.5523 22 18C22 17.4477 21.5523 17 21 17C20.4477 17 20 17.4477 20 18C20 18.5523 20.4477 19 21 19zM18 19C18.5523 19 19 18.5523 19 18C19 17.4477 18.5523 17 18 17C17.4477 17 17 17.4477 17 18C17 18.5523 17.4477 19 18 19z"
      />
    </Node>
  );
}

export const diskIconMeta: IconMeta = {
  id: 'disk-icon',
  name: 'Disk',
  description:
    'A stylized disk glyph for racks/storage visuals. Use DISK_COLOR for default, SUCCESS_DISK_COLOR for highlight, ERROR_COLOR for failure states.',
  tags: ['disk', 'storage', 'rack', 'ydb'],
  recommended: {
    scale: 2,
    x: -105,
    y: 0,
    colorNotes: 'Default fill via DISK_COLOR; animate fill for state transitions.',
  },
};


