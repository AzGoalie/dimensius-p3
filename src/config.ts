import { loadAudio, loadImages } from "./core/Assets";

export const assets = {
  images: await loadImages({
    background: {
      path: "./images/dimensius-heart.jpg",
    },
    player: {
      path: "./images/melee-dps.svg",
    },
    dimensius: {
      path: "./images/dimensius.png",
    },
    voidstar: {
      path: "./images/voidstar.png",
    },
  }),
  audio: await loadAudio({
    music: {
      path: "./audio/music.mp3",
      loop: true,
      volume: 0.2,
    },
    bloodlust: {
      path: "./audio/bloodlust.ogg",
      volume: 0.2,
    },
    info: {
      path: "./audio/info.ogg",
      volume: 0.2,
    },
    wrong: {
      path: "./audio/wrong.ogg",
      volume: 0.1,
    },
    alarm: {
      path: "./audio/alarm.ogg",
      volume: 0.1,
    },
    voidstar_crash: {
      path: "./audio/voidstar_crash.ogg",
      volume: 0.1,
    },
    shadowquake_cast: {
      path: "./audio/shadowquake_cast.ogg",
      volume: 0.2,
    },
    devour_cast: {
      path: "./audio/devour_cast.ogg",
      volume: 0.2,
    },
    devour_loop: {
      path: "./audio/devour_loop.ogg",
      volume: 0.2,
    },
    devour_explode: {
      path: "./audio/devour_explode.ogg",
      volume: 0.2,
    },
    blackhole_spawn: {
      path: "./audio/blackhole_spawn.ogg",
      volume: 0.2,
    },
    tank_pull: {
      path: "./audio/tank_pull.ogg",
      volume: 0.2,
    },
  }),
};

export const inputMap = {
  moveLeft: [{ key: "ArrowLeft" }, { key: "a" }],
  moveRight: [{ key: "ArrowRight" }, { key: "d" }],
  moveUp: [{ key: "ArrowUp" }, { key: "w" }],
  moveDown: [{ key: "ArrowDown" }, { key: "s" }],
};
