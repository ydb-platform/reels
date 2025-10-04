import {makeProject} from '@motion-canvas/core';
import example from './scenes/example?scene';

export default makeProject({
  scenes: [example],
  // Настройки для вертикального видео (TikTok/Instagram Reels)
  size: {width: 1080, height: 1920}, // 9:16 соотношение сторон
});
