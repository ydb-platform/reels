import {Node, Path} from '@motion-canvas/2d/lib/components';
import type {NodeProps} from '@motion-canvas/2d/lib/components';
import type {IconMeta} from './types';

/**
 * ClusterIcon — cluster/datacenter topology icon for YDB infrastructure visuals.
 *
 * Usage:
 * - Use for cluster overviews, datacenter representations, or infrastructure diagrams.
 * - Animate via Node signals (x, y, scale, opacity); adjust fill color as needed.
 */
export default function ClusterIcon(props: NodeProps) {
  return (
    <Node {...props}>
      <Path
        data="M260.353,254.878,131.538,33.1a2.208,2.208,0,0,0-3.829.009L.3,254.887A2.234,2.234,0,0,0,.3,257.122L129.116,478.9a2.208,2.208,0,0,0,3.83-.009L260.358,257.113A2.239,2.239,0,0,0,260.353,254.878Zm39.078-25.713a2.19,2.19,0,0,0,1.9,1.111h66.509a2.226,2.226,0,0,0,1.9-3.341L259.115,33.111a2.187,2.187,0,0,0-1.9-1.111H190.707a2.226,2.226,0,0,0-1.9,3.341ZM511.7,254.886,384.9,33.112A2.2,2.2,0,0,0,382.99,32h-66.6a2.226,2.226,0,0,0-1.906,3.34L440.652,256,314.481,476.66a2.226,2.226,0,0,0,1.906,3.34h66.6a2.2,2.2,0,0,0,1.906-1.112L511.7,257.114A2.243,2.243,0,0,0,511.7,254.886ZM366.016,284.917H299.508a2.187,2.187,0,0,0-1.9,1.111l-108.8,190.631a2.226,2.226,0,0,0,1.9,3.341h66.509a2.187,2.187,0,0,0,1.9-1.111l108.8-190.631A2.226,2.226,0,0,0,366.016,284.917Z"
        fill="currentColor"
      />
    </Node>
  );
}

export const clusterIconMeta: IconMeta = {
  id: 'cluster-icon',
  name: 'Cluster',
  description:
    'Cluster/datacenter topology icon for YDB infrastructure visuals. Use for cluster overviews, datacenter representations, or infrastructure diagrams.',
  tags: ['cluster', 'datacenter', 'infrastructure', 'topology', 'ydb'],
  recommended: {
    scale: 0.5,
    x: 0,
    y: 0,
    colorNotes: 'Uses currentColor fill; set fill prop to override.',
  },
};
