import { useEffect } from 'react';

export default function ProgressBar() {
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      document.getElementById('progress-bar').style.width = `${progress}%`;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-[1000]">
      <div id="progress-bar" className="h-full bg-blue-500 transition-all duration-300" style={{ width: '0%' }}></div>
    </div>
  );
}
