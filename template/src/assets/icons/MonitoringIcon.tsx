import {Node, Path} from '@motion-canvas/2d/lib/components';
import type {NodeProps} from '@motion-canvas/2d/lib/components';
import type {IconMeta} from './types';

/**
 * MonitoringIcon — chart/monitoring icon for YDB metrics and monitoring visuals.
 *
 * Usage:
 * - Use for monitoring dashboards, metrics charts, or performance visualization scenes.
 * - Animate via Node signals (x, y, scale, opacity); adjust fill color as needed.
 */
export default function MonitoringIcon(props: NodeProps & {fill?: string}) {
  const {fill = '#2399FF', ...nodeProps} = props;
  return (
    <Node {...nodeProps}>
      <Path
        data="M14.1953 11.375H3.125V3.55469C3.125 3.40234 2.97266 3.25 2.82031 3.25H1.80469C1.62695 3.25 1.5 3.40234 1.5 3.55469V12.6953C1.5 12.873 1.62695 13 1.80469 13H14.1953C14.3477 13 14.5 12.873 14.5 12.6953V11.6797C14.5 11.5273 14.3477 11.375 14.1953 11.375ZM10.9453 5.6875L8.8125 7.10938L6.62891 4.24023C6.50195 4.0625 6.24805 4.0625 6.12109 4.26562L3.9375 7.92188V10.5625H13.6875L11.4023 5.81445C11.3008 5.63672 11.0977 5.58594 10.9453 5.6875Z"
        fill={fill}
      />
    </Node>
  );
}

export const monitoringIconMeta: IconMeta = {
  id: 'monitoring-icon',
  name: 'Monitoring',
  description:
    'Chart/monitoring icon for YDB metrics and monitoring visuals. Use for monitoring dashboards, metrics charts, or performance visualization scenes.',
  tags: ['monitoring', 'charts', 'metrics', 'performance', 'ydb'],
  recommended: {
    scale: 4,
    x: 0,
    y: 0,
    colorNotes: 'Uses currentColor fill; set fill prop to override.',
  },
};
