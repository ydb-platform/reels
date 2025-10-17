import {Txt} from '@motion-canvas/2d/lib/components';
import type {TxtProps} from '@motion-canvas/2d/lib/components/Txt';

export default function Footer(props: TxtProps) {
  return (
    <Txt
      fontSize={42}
      textAlign={'center'}
      textWrap
      width={540}
      {...props}
    />
  );
}


