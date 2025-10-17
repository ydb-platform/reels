import {Txt} from '@motion-canvas/2d/lib/components';
import type {TxtProps} from '@motion-canvas/2d/lib/components/Txt';

export default function Title(props: TxtProps) {
  return (
    <Txt
      fontSize={80}
      fontWeight={700}
      textAlign={'center'}
      textWrap={true}
      marginLeft={50}
      marginRight={50}
      {...props}
    />
  );
}


