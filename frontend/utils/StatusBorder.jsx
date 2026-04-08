import React from "react";

const StatusBorder = ({
  image,
  segments = [false], // false = unviewed (green), true = viewed (gray)
  size = 60,
  strokeWidth = 4,
}) => {
  const total = Math.max(segments.length, 1);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // dynamic gap so many statuses still look good
  const gap =
    total <= 1 ? 0 :
    total <= 5 ? 6 :
    total <= 10 ? 4 : 2;

  const segmentLength = (circumference - total * gap) / total;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="absolute top-0 left-0 -rotate-90"
      >
        {segments.map((isViewed, i) => (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={isViewed ? "#9ca3af" : "#22c55e"} // gray / green
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
            strokeDashoffset={-(i * (segmentLength + gap))}
          />
        ))}
      </svg>

      <div
        className="z-10 rounded-full overflow-hidden bg-white p-0.5"
        style={{
          width: size - strokeWidth * 2,
          height: size - strokeWidth * 2,
        }}
      >
        <img
          src={image}
          alt="status"
          className="w-full h-full rounded-full object-cover"
        />
      </div>
    </div>
  );
};

export default StatusBorder;