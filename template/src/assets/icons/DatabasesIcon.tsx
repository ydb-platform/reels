import {Node, Path} from '@motion-canvas/2d/lib/components';
import type {NodeProps} from '@motion-canvas/2d/lib/components';
import type {IconMeta} from './types';

/**
 * DatabasesIcon — database/storage icon for YDB database representations.
 *
 * Usage:
 * - Use for database listings, storage visualizations, or data management scenes.
 * - Animate via Node signals (x, y, scale, opacity); adjust fill color as needed.
 */
export default function DatabasesIcon(props: NodeProps & {fill?: string}) {
  const {fill = '#2399FF', ...nodeProps} = props;
  return (
    <Node {...nodeProps}>
      <Path
        data="M16 1.5C16 2.32843 14.6569 3 13 3C11.3431 3 10 2.32843 10 1.5C10 0.671573 11.3431 0 13 0C14.6569 0 16 0.671573 16 1.5ZM5 11.6V14.3C5 15.2 6.3 15.9 8 15.9C9.7 15.9 11 15.2 11 14.3V11.6C10.2 12.3 9.1 12.6 8 12.6C6.9 12.6 5.8 12.3 5 11.6ZM10 3V2.60001C10.8 3.30001 11.9 3.60001 13 3.60001C14.1 3.60001 15.2 3.30001 16 2.60001V5.40001C16 6.20001 14.8 6.90001 13.2 7.00001L10.7247 9.8714C10.9014 10.0626 11 10.2755 11 10.5C11 11.3284 9.65685 12 8 12C6.34315 12 5 11.3284 5 10.5C5 10.2947 5.08248 10.0991 5.23177 9.92086L2.8 7.10001C1.3 7.00001 0 6.30001 0 5.50001V2.60001C0.8 3.30001 1.9 3.60001 3 3.60001C4.1 3.60001 5.2 3.30001 6 2.60001V3.00001L10 3ZM9.72421 9.27234C9.23641 9.10075 8.64174 9 8 9C7.7351 9 7.47822 9.01717 7.23356 9.0494C6.84837 9.09762 6.45653 9.18116 6.1 9.3L4 6.9C5.1 6.7 6 6.1 6 5.4V4H10V5.4C10 6.1 10.7 6.7 11.8 6.9L9.72421 9.27234ZM6 1.5C6 2.32843 4.65685 3 3 3C1.34315 3 0 2.32843 0 1.5C0 0.671573 1.34315 0 3 0C4.65685 0 6 0.671573 6 1.5Z"
        fill={fill}
      />
    </Node>
  );
}

export const databasesIconMeta: IconMeta = {
  id: 'databases-icon',
  name: 'Databases',
  description:
    'Database/storage icon for YDB database representations. Use for database listings, storage visualizations, or data management scenes.',
  tags: ['databases', 'storage', 'data', 'management', 'ydb'],
  recommended: {
    scale: 3,
    x: 0,
    y: 0,
    colorNotes: 'Uses currentColor fill; set fill prop to override.',
  },
};
