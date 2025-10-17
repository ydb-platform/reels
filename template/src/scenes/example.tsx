import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {createRef} from '@motion-canvas/core/lib/utils';
import {all, chain, waitFor} from '@motion-canvas/core/lib/flow';
import {
  Rect,
  Layout,
  Txt,
  Circle,
  Node,
  Line,
  Path,
} from '@motion-canvas/2d/lib/components';
import {Vector2} from '@motion-canvas/core/lib/types';
import {easeOutCubic} from '@motion-canvas/core/lib/tweening';
import YdbIcon from '../assets/icons/YdbIcon';
import Title from './Title';
import Footer from './Footer';
import {TEXT_COLOR} from '../assets/colors';

// Scene colors are sourced from ../assets/colors


export default makeScene2D(function* (view) {
  // Устанавливаем фон сцены
  
  const initialTitle = createRef<Txt>();
  const ydbIconRef = createRef<Node>();
  const footerRef = createRef<Txt>();

  // Add the YDB icon to the view
  view.add(
    <YdbIcon
      ref={ydbIconRef}
      x={-195}
      y={-165}
      scale={5}
      opacity={0}
    />
  );

  // Add the initial title to the view
  view.add(
    <Title
      ref={initialTitle}
      text="Шаблон для следующего рилса"
      fill={TEXT_COLOR}
      x={0}
      y={0}
      opacity={0}
    />
  );

  // Add the footer to the view (initially hidden)
  view.add(
    <Footer
      ref={footerRef}
      text=""
      y={700}
      opacity={0}
      fill={TEXT_COLOR}
    />
  );

    // Show the initial title
  yield* initialTitle().opacity(1, 0.5);
  
  // Wait for 3 seconds
  yield* waitFor(3);
  
  // Hide the initial title
  yield* initialTitle().opacity(0, 0.5);


  /////////////
  // тут новый контент
  /////////////


  yield* all(
    ydbIconRef().opacity(1, 2.5),
    initialTitle().opacity(0, 0),
    initialTitle().text('', 0),
  )

  // Wait for 3 seconds
  yield* waitFor(1);
  
  yield* all(
    ydbIconRef().y(-300, 0.5),
    initialTitle().y(200, 0.5),
    initialTitle().fontSize(130, 0),
    initialTitle().text('YDB', 0),
    initialTitle().opacity(1, 0.5),
  );
  
  yield* waitFor(1);

  // Hide the initial title
  yield* all(
    initialTitle().opacity(0, 0.5),
    initialTitle().text('', 0.5),
    initialTitle().fontSize(70, 0.5),
  );

  yield* initialTitle().text('Scale it easy', 0)

  yield* initialTitle().opacity(1, 0.5);

  yield* waitFor(0.5);

  yield* all(
    initialTitle().y(150, 0.15),
    initialTitle().scale(1.1, 0.15),
  )

  yield* all(
    initialTitle().y(200, 0.15),
    initialTitle().scale(1, 0.15),
  )

  yield* waitFor(1.5);
});
