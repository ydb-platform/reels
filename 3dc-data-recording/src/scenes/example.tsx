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

const DC_COLOR = '#a8b2ffff';
const DISK_COLOR = '#1185f8ff';
/** Color used for active disks in the visualization */
const DISK_ACTIVE_COLOR = '#9BB5D1';
/** Primary text color used in the scene */
const TEXT_COLOR = '#0053f9ff';
/** Color indicating successful operations or states */
const SUCCESS_COLOR = '#59ff00ff';
const SUCCESS_DISK_COLOR = '#62ff00ff';
const ERROR_COLOR = '#ff1100ff';
const PRIMARY_COLOR = '#0317f4ff';
const FAILURE_DC_COLOR = '#ff000080';
const BORDER_COLOR = '#1a52f9ff';

const DISK_SVG_PATH = "M0.691527 13.2189L2.71124 2.44713C2.97728 1.02822 4.21621 0 5.65985 0H18.3401C19.7838 0 21.0227 1.02822 21.2888 2.44713L23.3085 13.2189C22.8985 13.0771 22.4582 13 22 13H2C1.54176 13 1.10152 13.0771 0.691527 13.2189zM2 15H22C23.1046 15 24 15.8954 24 17V19C24 20.1046 23.1046 21 22 21H2C0.89543 21 0 20.1046 0 19V17C0 15.8954 0.89543 15 2 15zM21 19C21.5523 19 22 18.5523 22 18C22 17.4477 21.5523 17 21 17C20.4477 17 20 17.4477 20 18C20 18.5523 20.4477 19 21 19zM18 19C18.5523 19 19 18.5523 19 18C19 17.4477 18.5523 17 18 17C17.4477 17 17 17.4477 17 18C17 18.5523 17.4477 19 18 19z";


export default makeScene2D(function* (view) {
  // Устанавливаем фон сцены
  
  const initialTitle = createRef<Txt>();
  const ydbIconRef = createRef<Node>();
  const mainTitle = createRef<Txt>();
  const explanationText = createRef<Txt>();
  const rack1Cross = createRef<Line>();
  const rack1Cross2 = createRef<Line>();
  
  const dataCenterRefs = [];
  const dcNodeRefs = [];
  const diskRefs = [];
  const arrowRefs = [];
  const connectionRefs: any[] = []; // Permanent connections from DS Proxy to disks
 
  const diskPositions: Vector2[][] = [];

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

      // Show the YDB icon
  yield* ydbIconRef().opacity(1, 0.5);
  
  // Wait for 3 seconds
  yield* waitFor(1);
  
  // Hide the YDB icon
  yield* ydbIconRef().opacity(0, 0.5);


  // Add the initial title to the view
  view.add(
    <Txt
      ref={initialTitle}
      text="Надежная запись YDB в режиме трех датацентров"
      fontSize={80}
      fill={PRIMARY_COLOR}
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

  // Вертикальное размещение ДЦ для TikTok формата
  for (let i = 0; i < 3; i++) {
    const diskRefsInDC: any[] = [];
    
    const diskA = createRef<Path>();
    const diskB = createRef<Path>();
    const diskC = createRef<Path>();
    
    const dcNode = createRef<Node>();
    const dcRect = createRef<Rect>();

    dataCenterRefs.push(dcRect);
    dcNodeRefs.push(dcNode);
    diskRefs.push(diskRefsInDC);
    
    diskRefsInDC.push(diskA);
    diskRefsInDC.push(diskB);
    diskRefsInDC.push(diskC);

    // Позиционирование ДЦ (сдвинуто вправо)
    const dcX = 200;
    const dcY = -400 + i * 400;
    
    // Диски располагаются ВЕРТИКАЛЬНО друг над другом
    const diskX = dcX - 125; // Диски ближе к левому краю блока
    const diskAY = dcY - 102.5; // Верхний диск
    const diskBY = dcY;         // Средний диск
    const diskCY = dcY + 102.5; // Нижний диск
    
    diskPositions.push([
      new Vector2(diskX, diskAY),
      new Vector2(diskX, diskBY),
      new Vector2(diskX, diskCY)
    ]);

    view.add(
      <Node ref={dcNode} x={dcX} y={dcY}>
        <Rect
          ref={dcRect}
          width={250}
          height={300}
          radius={10}
          fill={DC_COLOR}
          stroke={BORDER_COLOR}
          lineWidth={4}
        >
          {/* Подпись ДЦ на верхней границе блока */}
          <Txt
            text={`ДЦ ${i + 1}`}
            fontSize={40}
            fontWeight={100}
            y={-190} // Позиция на верхней границе
            fill={TEXT_COLOR}
            stroke={TEXT_COLOR}
            lineWidth={2}
          />
          
          {/* Визуальное разделение на стойки */}
          <Line
            points={[[-100, -50], [100, -50]]}
            stroke={TEXT_COLOR}
            lineWidth={2}
            opacity={0.5}
          />
          <Line
            points={[[-100, 50], [100, 50]]}
            stroke={TEXT_COLOR}
            lineWidth={2}
            opacity={0.5}
          />
          
          {/* Подписи стоек */}
          <Txt
            text="Стойка 1"
            fontSize={20}
            x={30}
            y={-95}
            fill={TEXT_COLOR}
            opacity={0.7}
          />
          <Txt
            text="Стойка 2"
            fontSize={20}
            x={30}
            y={0}
            fill={TEXT_COLOR}
            opacity={0.7}
          />
          <Txt
            text="Стойка 3"
            fontSize={20}
            x={30}
            y={95}
            fill={TEXT_COLOR}
            opacity={0.7}
          />

          {/* Диски размещены вертикально */}
          <Path
            ref={diskA}
            data={DISK_SVG_PATH}
            fill={DISK_COLOR}
            scale={2}
            x={-105} // Позиционирование по горизонтали
            y={-120} // Верхний диск
          />
          <Path
            ref={diskB}
            data={DISK_SVG_PATH}
            fill={DISK_COLOR}
            scale={2}
            x={-105} // Позиционирование по горизонтали
            y={-20}   // Средний диск
          />
          <Path
            ref={diskC}
            data={DISK_SVG_PATH}
            fill={DISK_COLOR}
            scale={2}
            x={-105} // Позиционирование по горизонтали
            y={80} // Нижний диск
          />
        </Rect>
      </Node>
    );

  }

  // DS Proxy компонент - слева посередине
  const dsProxy = createRef<Rect>();
  view.add(
    <Rect
      ref={dsProxy}
      width={150}
      height={300}
      radius={10}
      fill={PRIMARY_COLOR}
      stroke={BORDER_COLOR}
      lineWidth={4}
      x={-300}
      y={0}
    >
      <Txt
        text="DS Proxy"
        fontSize={24}
        fill="white"
        fontWeight={700}
      />
    </Rect>
  );

  const dsProxyPos = new Vector2(dsProxy().x() + (dsProxy().width() / 2), dsProxy().y());

  // Точка отправки команд - теперь это DS Proxy
  const writeRequest = dsProxy; // Используем DS Proxy как точку отправки

  view.add(
    <>
      <Txt
        ref={mainTitle}
        text=""
        fontSize={42}
        y={-700}
        opacity={0}
        fill={PRIMARY_COLOR}
        fontWeight={700}
        textAlign="center"
        textWrap
        width={540}
      />
      <Txt
        ref={explanationText}
        text=""
        fontSize={42}
        y={700}
        opacity={0}
        fill={TEXT_COLOR}
        textAlign="center"
        textWrap
        width={540}
      />
    </>
  );
  
  yield* waitFor(1);

    // Функция для создания анимации стрелки, которая возвращает управление сразу после достижения цели
  const animateArrowToDisk = (arrowRef: any, startPos: Vector2, endPos: Vector2) => all(
    arrowRef().end(0, 0),
    // Создаем ломаную линию: горизонтально до середины, затем вертикально
    arrowRef().points([
      startPos,
      new Vector2(startPos.x + (endPos.x - startPos.x) * 0.5, startPos.y), // Горизонтальная часть
      new Vector2(startPos.x + (endPos.x - startPos.x) * 0.5, endPos.y),   // Вертикальная часть
      endPos
    ], 0),
    // Анимация стрелки до диска (без задержки после достижения)
    all(
      arrowRef().end(1, 0.8),
      arrowRef().opacity(1, 0.3)
    )
  );

    // Создаем постоянные соединения от DS Proxy ко всем дискам
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const connection = createRef<Line>();
      view.add(
          <Line
              ref={connection}
              points={[]}
              stroke={DISK_COLOR} // Синий цвет для доступных дисков по умолчанию
              lineWidth={4}
              lineDash={[5, 5]}
              opacity={1}
              end={0}
              zIndex={50-connectionRefs.length} // Постоянные соединения под анимационными стрелками
          />
      );
      connectionRefs.push(connection);
    }
  }

  yield* all(
    mainTitle().text('Сценарий 1:\nНормальный режим', 0.5), 
    mainTitle().opacity(1, 0.5),
  );

  yield* waitFor(1);

  yield* all(
    explanationText().text('DS Proxy держит постоянные соединения с дисками', 0.3),
    explanationText().opacity(1, 0.3),
    ...connectionRefs.map((connectionRef, i) => animateArrowToDisk(connectionRef, dsProxyPos, diskPositions[Math.floor(i/3)][i%3])),
  );

  // Создаем стрелки после всех других элементов, чтобы они были сверху
  // Создаем по 4 стрелки для каждого из 3 ДЦ, всего 12 стрелок
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
        const arrow = createRef<Line>();
        view.add(
            <Line
                ref={arrow}
                points={[]}
                stroke={SUCCESS_COLOR} // Все стрелки зеленые
                lineWidth={10}
                endArrow
                arrowSize={12}
                opacity={1}
                end={0}
                zIndex={100} // Убедимся, что стрелки сверху
            />
        );
        arrowRefs.push(arrow);
    }
  }

// Initialize connections after a short delay to ensure components are rendered
yield* waitFor(1);

yield* all(
  explanationText().text('', 0.3),
  explanationText().opacity(1, 0.3)
);

// --- Сценарий 1: Нормальный режим ---

  
  yield* waitFor(1);
  yield* all(
    explanationText().text('Запись идет на 1 диск\nв каждом ДЦ', 0.3),
    explanationText().opacity(1, 0.3)
  );

  // Функция для создания анимации стрелки, которая возвращает управление сразу после достижения цели и затем скрывает стрелку
  const animateArrowToDiskAndHide = (arrowRef: any, startPos: Vector2, endPos: Vector2) => chain(
    all(
      // Создаем ломаную линию: горизонтально до середины, затем вертикально
      arrowRef().points([
        startPos,
        new Vector2(startPos.x + (endPos.x - startPos.x) * 0.5, startPos.y), // Горизонтальная часть
        new Vector2(startPos.x + (endPos.x - startPos.x) * 0.5, endPos.y),   // Вертикальная часть
        endPos
      ], 0),
      // Анимация стрелки до диска (без задержки после достижения)
      all(
        arrowRef().end(1, 2.8),
        arrowRef().opacity(1, 2.7)
      )
    ),
    // Скрываем стрелку после завершения анимации
    arrowRef().opacity(0, 0)
  );

  const animateDiskWrite = (diskRef: any) => chain(
    waitFor(0.6), // Wait for arrow to arrive before lighting up disk
    all(
      diskRef().fill(SUCCESS_DISK_COLOR, 0.2),
      diskRef().scale(2.3, 0.2)
    ),
    waitFor(2),
    all(
      diskRef().fill(DISK_COLOR, 0.4),
      diskRef().scale(2, 0.4)
    )
  );

  // Функция для создания анимации стрелки с последующей подсветкой диска и скрытием стрелки
  const animateArrowWithDiskAndHide = (arrowRef: any, startPos: Vector2, endPos: Vector2, diskRef: any) => chain(
    all(
      animateArrowToDisk(arrowRef, startPos, endPos),
      // Запускаем анимацию диска с задержкой, она будет синхронизирована с прибытием стрелки
      animateDiskWrite(diskRef)
    ),
    // Скрываем стрелку после завершения анимации диска
    arrowRef().opacity(0, 0)
  );

  // Функция для создания анимации стрелки с последующей подсветкой диска
  const animateArrowWithDisk = (arrowRef: any, startPos: Vector2, endPos: Vector2, diskRef: any) => all(
    animateArrowToDisk(arrowRef, startPos, endPos),
    // Запускаем анимацию диска сразу, она будет синхронизирована с прибытием стрелки
    animateDiskWrite(diskRef)
  );

  yield* all(
    // ДЦ 1, диск A (верхний)
    animateArrowWithDiskAndHide(arrowRefs[0], new Vector2(dsProxyPos), diskPositions[0][0], diskRefs[0][0]),
    
    // ДЦ 2, диск A (верхний)
    animateArrowWithDiskAndHide(arrowRefs[2], new Vector2(dsProxyPos), diskPositions[1][0], diskRefs[1][0]),
    
    // ДЦ 3, диск A (верхний)
    animateArrowWithDiskAndHide(arrowRefs[4], new Vector2(dsProxyPos), diskPositions[2][0], diskRefs[2][0]),
  );

  // Сброс состояния сценария
  if (rack1Cross()) {
    rack1Cross().end(0, 0);
    rack1Cross().remove();
  }
  if (rack1Cross2()) {
    rack1Cross2().end(0, 0);
    rack1Cross2().remove();
  }

  yield* all(
    mainTitle().opacity(0, 0.5),
    explanationText().opacity(0, 0.5),
  );
  
    
  // --- Сценарий 2: Отказ стойки в ДЦ ---
  
  // Помечаем стойку 1 в ДЦ 1 как недоступную
  dcNodeRefs[0]().add(
    <>
      <Line ref={rack1Cross} points={[[-105, -122.5], [105, -72.5]]} stroke={ERROR_COLOR} lineWidth={6} end={0}/>
      <Line ref={rack1Cross2} points={[[-105, -72.5], [105, -122.5]]} stroke={ERROR_COLOR} lineWidth={6} end={0}/>
    </>
  );

  yield* all(
    mainTitle().text('Сценарий 2:\nОтказ диска или целой стойки в ДЦ', 0.5),
    explanationText().text('', 0),
    mainTitle().opacity(1, 0.5),
    rack1Cross().end(1, 0.5),
    rack1Cross2().end(1, 0.5),
    connectionRefs[0]().stroke(ERROR_COLOR, 0.5),
    diskRefs[0][0]().fill(ERROR_COLOR, 0.5),
  );

  yield* waitFor(1);
  
  yield* all(
    explanationText().text('Запись идет на 1 соседнюю стойку\nв ДЦ с отказом и по 1 стойке\nв каждом из других ДЦ', 0.3),
    explanationText().opacity(1, 0.3)
  );

  yield* waitFor(0.5);

  // Одновременная запись во все ДЦ
  // В первом ДЦ стрелка красная, так как попадает на отказавший стеллаж
  yield* all(
    // Зеленые стрелки в другие ДЦ с последующей подсветкой дисков
    animateArrowWithDiskAndHide(arrowRefs[5], new Vector2(dsProxyPos), diskPositions[0][1], diskRefs[0][1]),
    animateArrowWithDiskAndHide(arrowRefs[6], new Vector2(dsProxyPos), diskPositions[1][0], diskRefs[1][0]),
    animateArrowWithDiskAndHide(arrowRefs[7], new Vector2(dsProxyPos), diskPositions[2][0], diskRefs[2][0]),
    diskRefs[0][1]().lineWidth(10, 0.5),
    diskRefs[1][0]().lineWidth(10, 0.5),
    diskRefs[2][0]().lineWidth(10, 0.5),
  );
    
  // Добавляем очистку стрелок после завершения анимаций
  yield* waitFor(3);

  yield* all(
    mainTitle().opacity(0, 0.5), 
    explanationText().opacity(0, 0.5),
    connectionRefs[0]().stroke(DISK_COLOR, 0.5),
    diskRefs[0][0]().fill(DISK_COLOR, 0.5),
    arrowRefs[5]().end(0, 0),
    arrowRefs[6]().end(0, 0),
    arrowRefs[7]().end(0, 0),
    rack1Cross().end(0, 0),
    rack1Cross2().end(0, 0),
  );
  
  // --- Сценарий 3: Один ДЦ недоступен ---
  
  // Сбросим состояние предыдущих сценариев
  
  yield* all(
    mainTitle().text('Сценарий 3:\nОтказ одного ДЦ', 0.5),
    mainTitle().opacity(1, 0.5),
    explanationText().text('', 0),
  );

  yield* waitFor(1);

  const dc3Cross = createRef<Line>();
  const dc3Cross2 = createRef<Line>();
  dcNodeRefs[2]().add(
    <>
      <Line ref={dc3Cross} points={[[-150, -100], [150, 100]]} stroke={ERROR_COLOR} lineWidth={8} end={0}/>
      <Line ref={dc3Cross2} points={[[-150, 100], [150, -100]]} stroke={ERROR_COLOR} lineWidth={8} end={0}/>
    </>
  );
  
  yield* all(
    dataCenterRefs[2]().fill(FAILURE_DC_COLOR, 0.5),
    dc3Cross().end(1, 0.5),
    dc3Cross2().end(1, 0.5),
    connectionRefs[6]().zIndex(51, 0.5),
    connectionRefs[6]().stroke(ERROR_COLOR, 0.5),
    diskRefs[2][0]().fill(ERROR_COLOR, 0.5),
    connectionRefs[7]().zIndex(51, 0.5),
    connectionRefs[7]().stroke(ERROR_COLOR, 0.5),
    diskRefs[2][1]().fill(ERROR_COLOR, 0.5),
    connectionRefs[8]().zIndex(51, 0.5),
    connectionRefs[8]().stroke(ERROR_COLOR, 0.5),
    diskRefs[2][2]().fill(ERROR_COLOR, 0.5),
  );
  
  yield* waitFor(0.5);


  yield* all(
    explanationText().text('Попытка записи по 1 диску\nв каждом ДЦ', 0.3),
    explanationText().opacity(1, 0.3)
  );

  // Первоначальная попытка записи - по 1 диску в каждом ДЦ
  yield* all(
    explanationText().text('Дополнительно пишутся\nеще 2 копии по 1 в соседние стойки\nв доступных ДЦ', 0.3),
    explanationText().opacity(1, 0.3),
    animateArrowWithDiskAndHide(arrowRefs[0], new Vector2(dsProxyPos), diskPositions[0][0], diskRefs[0][0]),
    animateArrowWithDiskAndHide(arrowRefs[1], new Vector2(dsProxyPos), diskPositions[0][1], diskRefs[0][1]),
    animateArrowWithDiskAndHide(arrowRefs[2], new Vector2(dsProxyPos), diskPositions[1][0], diskRefs[1][0]),
    animateArrowWithDiskAndHide(arrowRefs[3], new Vector2(dsProxyPos), diskPositions[1][1], diskRefs[1][1]),
  );

  yield* all(
    mainTitle().text('', 0.5),
    mainTitle().opacity(0, 0.5), 
    explanationText().opacity(0, 0.5),
    dc3Cross().end(0, 0),
    dc3Cross2().end(0, 0),
    dataCenterRefs[2]().fill(DC_COLOR, 0.5),
    dc3Cross().end(0, 0.5),
    dc3Cross2().end(0, 0.5),
    connectionRefs[6]().stroke(DISK_COLOR, 0.5),
    diskRefs[2][0]().fill(DISK_COLOR, 0.5),
    connectionRefs[7]().stroke(DISK_COLOR, 0.5),
    diskRefs[2][1]().fill(DISK_COLOR, 0.5),
    connectionRefs[8]().stroke(DISK_COLOR, 0.5),
    diskRefs[2][2]().fill(DISK_COLOR, 0.5),
  );

  // --- Сценарий 4: Недоступен один ДЦ и одна стойка в другом ДЦ ---
  
  yield* all(
    mainTitle().text('Сценарий 4:\nНедоступен один ДЦ и одна стойка в другом ДЦ', 0.5),
    mainTitle().opacity(1, 0.5),
    explanationText().text('', 0),
  );

  yield* waitFor(1);

  yield* all(
    dataCenterRefs[2]().fill(FAILURE_DC_COLOR, 0.5),
    dc3Cross().end(1, 0.5),
    dc3Cross2().end(1, 0.5),
    rack1Cross().end(1, 0.5),
    rack1Cross2().end(1, 0.5),
    connectionRefs[0]().zIndex(51, 0.5),
    connectionRefs[0]().stroke(ERROR_COLOR, 0.5),
    connectionRefs[6]().zIndex(51, 0.5),
    connectionRefs[6]().stroke(ERROR_COLOR, 0.5),
    diskRefs[2][0]().fill(ERROR_COLOR, 0.5),
    connectionRefs[7]().zIndex(51, 0.5),
    connectionRefs[7]().stroke(ERROR_COLOR, 0.5),
    diskRefs[2][1]().fill(ERROR_COLOR, 0.5),
    connectionRefs[8]().zIndex(51, 0.5),
    connectionRefs[8]().stroke(ERROR_COLOR, 0.5),
    diskRefs[2][2]().fill(ERROR_COLOR, 0.5),
  );
  
  yield* waitFor(0.5);

  // Первоначальная попытка записи - по 1 диску в каждом ДЦ
  yield* all(
    explanationText().text('Пишутся 2 копии в доступные стойки доступных ДЦ', 0.3),
    explanationText().opacity(1, 0.3),
    animateArrowWithDiskAndHide(arrowRefs[0], new Vector2(dsProxyPos), diskPositions[0][1], diskRefs[0][1]),
    animateArrowWithDiskAndHide(arrowRefs[1], new Vector2(dsProxyPos), diskPositions[0][2], diskRefs[0][2]),
    animateArrowWithDiskAndHide(arrowRefs[2], new Vector2(dsProxyPos), diskPositions[1][0], diskRefs[1][0]),
    animateArrowWithDiskAndHide(arrowRefs[3], new Vector2(dsProxyPos), diskPositions[1][1], diskRefs[1][1]),
  );

  yield* all(
    mainTitle().text('', 0.5),
    mainTitle().opacity(0, 0.5), 
    explanationText().opacity(0, 0.5),
    dc3Cross().end(0, 0),
    dc3Cross2().end(0, 0),
    rack1Cross().end(0, 0),
    rack1Cross2().end(0, 0),
    dataCenterRefs[2]().fill(DC_COLOR, 0.5),
    dc3Cross().end(0, 0.5),
    dc3Cross2().end(0, 0.5),
    connectionRefs[0]().stroke(DISK_COLOR, 0.5),
    connectionRefs[6]().stroke(DISK_COLOR, 0.5),
    diskRefs[2][0]().fill(DISK_COLOR, 0.5),
    connectionRefs[7]().stroke(DISK_COLOR, 0.5),
    diskRefs[2][1]().fill(DISK_COLOR, 0.5),
    connectionRefs[8]().stroke(DISK_COLOR, 0.5),
    diskRefs[2][2]().fill(DISK_COLOR, 0.5),
  );
  

  yield* all(
    ...dataCenterRefs.map((dc) => dc().opacity(0, 2.5)),
    ...connectionRefs.map((connection) => connection().opacity(0, 2.5)),
    dsProxy().opacity(0, 2.5),
    ydbIconRef().opacity(1, 2.5),
    initialTitle().opacity(0, 0),
    initialTitle().text('Scale it easy', 0),
  )

  // Wait for 3 seconds
  yield* waitFor(1);
  
  yield* all(
    ydbIconRef().opacity(0, 0.5),
    initialTitle().text('Scale it easy', 0.5),
    initialTitle().opacity(1, 0.5),
  );
  
  // Wait for 3 seconds
  yield* waitFor(1);
  
  // Hide the initial title
  yield* initialTitle().opacity(0, 0.5);

});
