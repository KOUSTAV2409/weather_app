import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface Props {
  condition: string;
}

const WeatherSounds = ({ condition }: Props) => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getSoundUrl = (cond: string): string | null => {
    const c = cond.toLowerCase();
    // Using free ambient sound URLs (you can replace with actual hosted sounds)
    if (c.includes('rain')) return 'https://assets.mixkit.co/active_storage/sfx/2390/2390-preview.mp3';
    if (c.includes('storm')) return 'https://assets.mixkit.co/active_storage/sfx/2393/2393-preview.mp3';
    if (c.includes('clear')) return 'https://assets.mixkit.co/active_storage/sfx/2462/2462-preview.mp3';
    return null;
  };

  const soundUrl = getSoundUrl(condition);

  useEffect(() => {
    if (soundUrl && playing) {
      audioRef.current = new Audio(soundUrl);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => setPlaying(false));
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [playing, soundUrl]);

  if (!soundUrl) return null;

  return (
    <button
      onClick={() => setPlaying(!playing)}
      className="fixed bottom-6 right-6 p-4 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-lg hover:opacity-80 transition-all z-40"
      title={playing ? 'Stop ambient sounds' : 'Play ambient sounds'}
    >
      {playing ? <Volume2 size={24} /> : <VolumeX size={24} />}
    </button>
  );
};

export default WeatherSounds;
