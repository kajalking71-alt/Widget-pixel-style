import React from 'react';

interface WeatherIconProps {
  condition: 'sunny' | 'cloudy' | 'rain' | 'partly-cloudy' | 'thunder' | 'snow';
  size?: number;
  className?: string;
  primaryColor?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  condition,
  size = 28,
  className = '',
  primaryColor = '#FDB813',
}) => {
  switch (condition) {
    case 'sunny':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`shrink-0 ${className}`}
        >
          <circle cx="24" cy="24" r="11" fill={primaryColor} />
          {/* Subtle soft rays */}
          <circle cx="24" cy="24" r="14" stroke={primaryColor} strokeWidth="2.5" strokeDasharray="3 4" opacity="0.8" />
        </svg>
      );

    case 'partly-cloudy':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`shrink-0 ${className}`}
        >
          <circle cx="31" cy="19" r="8" fill={primaryColor} />
          <path
            d="M34 34H17C13.134 34 10 30.866 10 27C10 23.36 12.77 20.37 16.36 20.04C17.7 15.96 21.5 13 26 13C31.523 13 36 17.477 36 23C36 23.34 35.98 23.68 35.95 24.01C38.27 24.96 39.9 27.28 39.9 30C39.9 32.21 38.1 34 34 34Z"
            fill="currentColor"
            fillOpacity="0.88"
          />
        </svg>
      );

    case 'cloudy':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`shrink-0 ${className}`}
        >
          <path
            d="M36 34H17C12.58 34 9 30.42 9 26C9 21.87 12.13 18.47 16.2 18.05C17.7 13.96 21.5 11 26 11C31.52 11 36 15.48 36 21C36 21.34 35.98 21.68 35.95 22.01C38.8 23.1 40.8 25.8 40.8 29C40.8 31.76 38.6 34 36 34Z"
            fill="currentColor"
            fillOpacity="0.88"
          />
        </svg>
      );

    case 'rain':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`shrink-0 ${className}`}
        >
          <path
            d="M34 27H17C13.13 27 10 23.87 10 20C10 16.36 12.77 13.37 16.36 13.04C17.7 8.96 21.5 6 26 6C31.52 6 36 10.48 36 16C36 16.34 35.98 16.68 35.95 17.01C38.27 17.96 39.9 20.28 39.9 23C39.9 25.21 38.1 27 34 27Z"
            fill="currentColor"
            fillOpacity="0.75"
          />
          <path d="M18 32L15 39" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M26 32L23 40" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M34 32L31 39" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'thunder':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`shrink-0 ${className}`}
        >
          <path
            d="M34 25H17C13.13 25 10 21.87 10 18C10 14.36 12.77 11.37 16.36 11.04C17.7 6.96 21.5 4 26 4C31.52 4 36 8.48 36 14C36 14.34 35.98 14.68 35.95 15.01C38.27 15.96 39.9 18.28 39.9 21C39.9 23.21 38.1 25 34 25Z"
            fill="currentColor"
            fillOpacity="0.8"
          />
          <path
            d="M24 23L18 33H25L23 43L33 30H26L28 23H24Z"
            fill="#FBBF24"
            stroke="#F59E0B"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'snow':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`shrink-0 ${className}`}
        >
          <path
            d="M34 26H17C13.13 26 10 22.87 10 19C10 15.36 12.77 12.37 16.36 12.04C17.7 7.96 21.5 5 26 5C31.52 5 36 9.48 36 15C36 15.34 35.98 15.68 35.95 16.01C38.27 16.96 39.9 19.28 39.9 22C39.9 24.21 38.1 26 34 26Z"
            fill="currentColor"
            fillOpacity="0.8"
          />
          <circle cx="17" cy="34" r="2" fill="#BAE6FD" />
          <circle cx="26" cy="38" r="2" fill="#BAE6FD" />
          <circle cx="33" cy="33" r="2" fill="#BAE6FD" />
        </svg>
      );

    default:
      return null;
  }
};
