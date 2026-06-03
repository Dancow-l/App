import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  MapPin,
  Navigation,
  RefreshCw,
} from 'lucide-react';

// Qibla coordinates for Kaaba
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

function calculateQibla(lat: number, lng: number): number {
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;
  const kaabaLatRad = (KAABA_LAT * Math.PI) / 180;
  const kaabaLngRad = (KAABA_LNG * Math.PI) / 180;

  const y = Math.sin(kaabaLngRad - lngRad);
  const x =
    Math.cos(latRad) * Math.tan(kaabaLatRad) -
    Math.sin(latRad) * Math.cos(kaabaLngRad - lngRad);

  let qibla = (Math.atan2(y, x) * 180) / Math.PI;
  if (qibla < 0) qibla += 360;
  return Math.round(qibla);
}

// Extend DeviceOrientationEvent for iOS
declare global {
  interface DeviceOrientationEvent {
    webkitCompassHeading?: number;
  }
}

export default function QiblaCompass() {
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  const [deviceAngle, setDeviceAngle] = useState(0);
  const [locationName, setLocationName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const compassRef = useRef<HTMLDivElement>(null);

  const requestLocation = useCallback(() => {
    setLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const qibla = calculateQibla(latitude, longitude);
        setQiblaAngle(qibla);
        setLoading(false);
        setLocationName(`${latitude.toFixed(2)}, ${longitude.toFixed(2)}`);
      },
      (err) => {
        setError('Unable to get your location. Please enable GPS.');
        setLoading(false);
        console.error('Geolocation error:', err);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  // Listen for device orientation
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      let angle = 0;
      if (event.webkitCompassHeading) {
        // iOS
        angle = event.webkitCompassHeading;
      } else if (event.alpha !== null) {
        // Android
        angle = 360 - event.alpha;
      }
      setDeviceAngle(angle);
    };

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      }
    };
  }, []);

  // Calculate compass rotation
  const compassRotation = qiblaAngle !== null ? qiblaAngle - deviceAngle : 0;

  return (
    <div className="min-h-screen pb-24 pt-6 px-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-[#1D2B24] dark:text-[#F6F6F2] mb-1">
          Prayer Compass
        </h1>
        <p className="text-sm text-[#6E8078] dark:text-[#8fa396]">
          Find the direction to the Kaaba
        </p>
      </motion.div>

      {/* Compass Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-[#1e3028] rounded-[28px] p-6 mb-5 shadow-[0_14px_40px_rgba(29,43,36,0.07)] border border-[#E8F3E3]/50 dark:border-[#2a4035] flex flex-col items-center"
      >
        {/* Compass Dial */}
        <div
          ref={compassRef}
          className="relative w-56 h-56 mb-6"
        >
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-[#E8F3E3] dark:border-[#2a4035]" />

          {/* Degree ticks */}
          {Array.from({ length: 72 }, (_, i) => {
            const angle = i * 5;
            const isMain = angle % 90 === 0;
            const isSub = angle % 30 === 0;
            return (
              <div
                key={angle}
                className={`absolute left-1/2 top-0 origin-bottom ${
                  isMain
                    ? 'h-3 w-0.5 bg-[#1D2B24] dark:bg-[#F6F6F2]'
                    : isSub
                    ? 'h-2 w-0.5 bg-[#6E8078] dark:bg-[#8fa396]'
                    : 'h-1.5 w-px bg-[#C8D8C4] dark:bg-[#3a5a45]'
                }`}
                style={{
                  transform: `translateX(-50%) rotate(${angle}deg)`,
                  transformOrigin: '50% 112px',
                }}
              />
            );
          })}

          {/* Cardinal directions */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 text-xs font-bold text-[#1D2B24] dark:text-[#F6F6F2]">
            N
          </div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs font-bold text-[#1D2B24] dark:text-[#F6F6F2]">
            S
          </div>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#1D2B24] dark:text-[#F6F6F2]">
            W
          </div>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#1D2B24] dark:text-[#F6F6F2]">
            E
          </div>

          {/* Rotating compass needle/arrow */}
          {qiblaAngle !== null && (
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: compassRotation }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              {/* Qibla arrow */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2">
                <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-b-[50px] border-l-transparent border-r-transparent border-b-[#F2C4A7]" />
              </div>
              {/* Back of arrow */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rotate-180">
                <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[30px] border-l-transparent border-r-transparent border-b-[#C8D8C4] dark:border-b-[#4a6a55]" />
              </div>

              {/* Kaaba icon at top */}
              <div className="absolute top-1 left-1/2 -translate-x-1/2 -translate-y-1">
                <div className="w-5 h-5 bg-[#1D2B24] dark:bg-[#F6F6F2] rounded-sm flex items-center justify-center">
                  <div className="w-2 h-2 border border-[#F2C4A7] rounded-sm" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#1D2B24] dark:bg-[#F6F6F2] rounded-full" />

          {/* No location state */}
          {qiblaAngle === null && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Compass className="w-16 h-16 text-[#C8D8C4] dark:text-[#3a5a45]" />
            </div>
          )}
        </div>

        {/* Qibla Info */}
        {qiblaAngle !== null ? (
          <div className="text-center mb-4">
            <p className="text-3xl font-bold text-[#1D2B24] dark:text-[#F6F6F2]">
              {qiblaAngle}°
            </p>
            <p className="text-sm text-[#6E8078] dark:text-[#8fa396] mt-1">
              Qibla direction from your location
            </p>
            {locationName && (
              <div className="flex items-center justify-center gap-1 mt-2 text-xs text-[#6E8078] dark:text-[#8fa396]">
                <MapPin className="w-3 h-3" />
                {locationName}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center mb-4">
            <p className="text-sm text-[#6E8078] dark:text-[#8fa396]">
              Tap the button below to get your Qibla direction
            </p>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={requestLocation}
          disabled={loading}
          className="flex items-center gap-2 bg-[#1D2B24] dark:bg-[#F6F6F2] text-white dark:text-[#1D2B24] px-6 py-3 rounded-full text-sm font-semibold hover:scale-[1.03] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
          {loading ? 'Getting location...' : qiblaAngle !== null ? 'Refresh' : 'Set Location'}
        </button>

        {error && (
          <p className="text-xs text-red-500 mt-3 text-center">{error}</p>
        )}
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#E8F3E3] dark:bg-[#1a2e22] rounded-[24px] p-5"
      >
        <h3 className="text-sm font-semibold text-[#1D2B24] dark:text-[#F6F6F2] mb-2">
          How to use
        </h3>
        <ol className="text-sm text-[#6E8078] dark:text-[#8fa396] space-y-2 list-decimal list-inside">
          <li>Stand in an open area away from magnetic interference</li>
          <li>Hold your phone flat and parallel to the ground</li>
          <li>Rotate slowly until the arrow points to Qibla</li>
          <li>The arrow shows the direction to the Kaaba in Makkah</li>
        </ol>
      </motion.div>
    </div>
  );
}
