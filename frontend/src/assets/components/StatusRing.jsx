import React from "react";

const StatusRing = ({ total = 4, seenCount = 1, size = 58, image }) => {
  const strokeWidth = 4;
  const radius = 46;
  const circumference = 2 * Math.PI * radius;

  const gap = 6; // gap between segments
  const segmentLength = (circumference - total * gap) / total;

  return (
    <div className="relative " style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full -rotate-90"
      >
        {Array.from({ length: total }).map((_, index) => {
          const dashArray = `${segmentLength} ${circumference - segmentLength}`;
          const dashOffset = -index * (segmentLength + gap);

          const isSeen = index < seenCount;

          return (
            <circle
              key={index}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={isSeen ? "#9CA3AF" : "#25D366"} // gray : green
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
            />
          );
        })}
      </svg>

      <img
        src={image}
        alt="profile"
        className="absolute inset-1.5 w-[calc(100%-12px)] h-[calc(100%-12px)] rounded-full object-cover"
      />
    </div>
  );
};

export default StatusRing;