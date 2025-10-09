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

/** Primary text color used in the scene */
const TEXT_COLOR = '#2399FF';
/** Color indicating successful operations or states */
const SUCCESS_COLOR = '#00fa92ff';
const ERROR_COLOR = '#ff1100ff';
const PRIMARY_COLOR = '#0317f4ff';
const BORDER_COLOR = '#1a52f9ff';

const DISK_SVG_PATH = "M0.691527 13.2189L2.71124 2.44713C2.97728 1.02822 4.21621 0 5.65985 0H18.3401C19.7838 0 21.0227 1.02822 21.2888 2.44713L23.3085 13.2189C22.8985 13.0771 22.4582 13 22 13H2C1.54176 13 1.10152 13.0771 0.691527 13.2189zM2 15H22C23.1046 15 24 15.8954 24 17V19C24 20.1046 23.1046 21 22 21H2C0.89543 21 0 20.1046 0 19V17C0 15.8954 0.89543 15 2 15zM21 19C21.5523 19 22 18.5523 22 18C22 17.4477 21.5523 17 21 17C20.4477 17 20 17.4477 20 18C20 18.5523 20.4477 19 21 19zM18 19C18.5523 19 19 18.5523 19 18C19 17.4477 18.5523 17 18 17C17.4477 17 17 17.4477 17 18C17 18.5523 17.4477 19 18 19z";


export default makeScene2D(function* (view) {
  // Устанавливаем фон сцены
  
  const initialTitle = createRef<Txt>();
  const ydbIconRef = createRef<Node>();
  const mainTitle = createRef<Txt>();
  const explanationText = createRef<Txt>();

  // Add the YDB icon to the view
  view.add(
    <Node
      ref={ydbIconRef}
      x={-195}
      y={-165}
      scale={5}
      opacity={0}
    >
      <Path
        data="M1.36861 14.7446C1.36861 10.3047 8.10884 7.93796 16.4234 7.93796 24.7379 7.93796 31.4781 10.3047 31.4781 14.7446L31.4781 37.8101C31.4781 42.2499 24.7379 44.6168 16.4234 44.6168 8.10884 44.6168 1.36861 42.2499 1.36861 37.8101L1.36861 14.7446Z"
        fill="#2399FF"
      />
      <Path
        data="M47.9015 14.7446C47.9015 10.3047 54.6416 7.93796 62.9562 7.93796 71.2708 7.93796 78.0109 10.3047 78.0109 14.7446L78.0109 37.8101C78.0109 42.2499 71.2708 44.6168 62.9562 44.6168 54.6416 44.6168 47.9015 42.2499 47.9015 37.8101L47.9015 14.7446Z"
        fill="#2399FF"
      />
      <Path
        data="M48.4489 23.2664 30.9307 23.2664 30.9307 28.1934 48.4489 28.1934 48.4489 23.2664Z"
        fill="#2399FF"
      />
      <Path
        data="M47.354 42.9745 31.4781 42.9745 22.1715 30.3832 16.1496 30.3832 28.7409 47.354 50.0912 47.354 62.6825 30.3832 56.6606 30.3832 47.354 42.9745Z"
        fill="#FFFFFF"
      />
      <Path
        data="M24.3613 39.9271C24.3613 35.4873 31.1015 33.1204 39.4161 33.1204 47.7307 33.1204 54.4708 35.4873 54.4708 39.9271L54.4708 62.9926C54.4708 67.4324 47.7307 69.7993 39.4161 69.7993 31.1015 69.7993 24.3613 67.4324 24.3613 62.9926L24.3613 39.9271Z"
        fill="#2399FF"
      />
      <Path
        data="M29.7764 37.4395C27.4026 38.4723 27.0985 39.4809 27.0985 39.9635 27.0985 40.4461 27.4026 41.4547 29.7764 42.4875 32.0463 43.4751 35.4293 44.0693 39.4161 44.0693 43.4028 44.0693 46.7858 43.4751 49.056 42.4875 51.4295 41.4547 51.7336 40.4461 51.7336 39.9635 51.7336 39.4809 51.4295 38.4723 49.056 37.4395 46.7858 36.4519 43.4028 35.8577 39.4161 35.8577 35.4293 35.8577 32.0463 36.4519 29.7764 37.4395Z"
        fill="#FFFFFF"
      />
      <Path
        data="M6.78353 12.2571C4.40981 13.2896 4.10584 14.2983 4.10584 14.781 4.10584 15.2637 4.40981 16.2724 6.78353 17.305 9.05373 18.2925 12.4367 18.8869 16.4234 18.8869 20.41 18.8869 23.793 18.2925 26.0632 17.305 28.4368 16.2724 28.7409 15.2637 28.7409 14.781 28.7409 14.2983 28.4368 13.2896 26.0632 12.2571 23.793 11.2695 20.41 10.6752 16.4234 10.6752 12.4367 10.6752 9.05373 11.2695 6.78353 12.2571Z"
        fill="#FFFFFF"
      />
      <Path
        data="M53.3165 12.2571C50.9428 13.2896 50.6387 14.2983 50.6387 14.781 50.6387 15.2637 50.9428 16.2724 53.3165 17.305 55.5865 18.2925 58.9694 18.8869 62.9562 18.8869 66.943 18.8869 70.3259 18.2925 72.5962 17.305 74.9696 16.2724 75.2737 15.2637 75.2737 14.781 75.2737 14.2983 74.9696 13.2896 72.5962 12.2571 70.3259 11.2695 66.943 10.6752 62.9562 10.6752 58.9694 10.6752 55.5865 11.2695 53.3165 12.2571Z"
        fill="#FFFFFF"
      />
    </Node>
  );

  // Add the initial title to the view
  view.add(
    <Txt
      ref={initialTitle}
      text="Шаблон для следующего рилса"
      fontSize={80}
      fill={TEXT_COLOR}
      fontWeight={700}
      textAlign="center"
      x={0}
      y={0}
      textWrap={true}
      marginLeft={50}
      marginRight={50}
      opacity={0}
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
