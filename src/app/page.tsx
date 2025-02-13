// src/app/page.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { Heart, Music, MicOff } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const [currentStage, setCurrentStage] = useState(0);
  const [showProposal, setShowProposal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [noButtonState, setNoButtonState] = useState(0);
  const [hearts, setHearts] = useState<Array<{ id: number; left: number; delay: number }>>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const noButtonTexts = [
    'No',
    'Are you sure?',
    'Okay...',
    "Yo yo yo I&apos;m kidding 😂😂😂"
  ];

  const memories = [
    { image: '/photo1.jpg', text: 'Remember our first date?' },
    { image: '/photo2.jpg', text: 'All the laughs we shared...' },
    { image: '/photo3.jpg', text: 'The adventures we went on...' },
    { image: '/photo4.jpg', text: 'And all the moments that made me fall for you...' },
  ];

  useEffect(() => {
    setHearts(Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10
    })));
  }, []);

  useEffect(() => {
    if (noButtonState === 2) {
      const timer = setTimeout(() => {
        setNoButtonState(3);
        // After showing the kidding message, reset after 2 seconds
        const resetTimer = setTimeout(() => {
          setNoButtonState(0);
        }, 2000);
        return () => clearTimeout(resetTimer);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [noButtonState]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAccept = () => {
    setAccepted(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
    }
  };

  const handleNoClick = () => {
    if (noButtonState < 3) {
      setNoButtonState(prev => prev + 1);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStage < memories.length - 1) {
        setCurrentStage(currentStage + 1);
      } else if (!showProposal) {
        setShowProposal(true);
      }
    }, 8000);

    return () => clearTimeout(timer);
  }, [currentStage, memories.length, showProposal]);

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-pink-100 to-red-100 overflow-hidden">
      <audio
        ref={audioRef}
        src="/your-romantic-song.mp3"
        loop
      />
      <button
        onClick={toggleMusic}
        className="fixed top-4 right-4 z-50 p-3 bg-white rounded-full shadow-lg"
      >
        {isPlaying ? <MicOff className="text-pink-600" /> : <Music className="text-pink-600" />}
      </button>

      <div className="fixed inset-0 pointer-events-none">
        {hearts.map(({ id, left, delay }) => (
          <Heart
            key={id}
            className="absolute text-pink-300 opacity-50"
            style={{
              left: `${left}%`,
              top: '100%',
              transform: 'scale(0.5)',
              animation: `float 15s linear infinite`,
              animationDelay: `-${delay}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {accepted ? (
            <div className="text-center space-y-8 animate-fade-in">
              <h1 className="text-4xl font-bold text-pink-600 mb-8">
                🎉 Thank You Idanla! 🎉
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {memories.map((memory, index) => (
                  <div 
                    key={index} 
                    className="animate-scale-in bg-white rounded-lg shadow-lg overflow-hidden"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="relative pt-[100%]">
                      <Image
                        src={memory.image}
                        alt="Our memory"
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-contain bg-black"
                        priority={index === 0}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-2xl text-pink-500 animate-bounce mt-8">
                ❤️ Looking forward to making more memories with you! ❤️
              </p>
            </div>
          ) : !showProposal ? (
            <div className="memory-container">
              <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
                <div className="relative pt-[75%]">
                  <Image
                    src={memories[currentStage].image}
                    alt="Memory"
                    fill
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    className="object-contain bg-black"
                    priority
                  />
                </div>
                <div className="p-6 text-center">
                  <p className="text-2xl font-semibold text-pink-600">
                    {memories[currentStage].text}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-8 animate-fade-in">
              <h1 className="text-4xl font-bold text-pink-600 mb-8">
                Will you be my Valentine?
              </h1>
              <div className="flex flex-col space-y-4 items-center">
                <button
                  onClick={handleAccept}
                  className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full text-xl transform hover:scale-110 transition-all duration-300 w-64"
                >
                  Yes, I&apos;d love to! ❤️
                </button>
                <button
                  onClick={handleNoClick}
                  className={`bg-gray-500 text-white font-bold py-3 px-8 rounded-full text-xl 
                    transition-all duration-300 w-64
                    ${noButtonState === 3 ? 'animate-wiggle bg-pink-500' : 'opacity-50'}`}
                >
                  {noButtonTexts[noButtonState]}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}