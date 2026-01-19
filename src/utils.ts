export function cloneAudio(audio: HTMLAudioElement) {
  // Hate this hack...
  const clone = audio.cloneNode(true) as HTMLAudioElement;
  clone.volume = audio.volume;
  return clone;
}
