// FILE: /components/feedback/Skeleton.tsx
import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  animated?: boolean;
}

export function Skeleton({
  className = '',
  width,
  height,
  rounded = 'md',
  animated = true
}: SkeletonProps) {
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded',
    lg: 'rounded-lg',
    full: 'rounded-full'
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`
        bg-gray-200 dark:bg-gray-700
        ${roundedClasses[rounded]}
        ${animated ? 'animate-pulse' : ''}
        ${className}
      `}
      style={style}
    />
  );
}

interface SkeletonTextProps {
  lines?: number;
  className?: string;
  width?: string | number;
  lastLineWidth?: string | number;
}

export function SkeletonText({
  lines = 3,
  className = '',
  width = '100%',
  lastLineWidth = '60%'
}: SkeletonTextProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          height={16}
          width={index === lines - 1 ? lastLineWidth : width}
          className="h-4"
        />
      ))}
    </div>
  );
}

interface SkeletonCardProps {
  className?: string;
  showImage?: boolean;
  showTitle?: boolean;
  showText?: boolean;
  showActions?: boolean;
}

export function SkeletonCard({
  className = '',
  showImage = true,
  showTitle = true,
  showText = true,
  showActions = true
}: SkeletonCardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      {showImage && (
        <Skeleton width="100%" height={120} className="mb-4" />
      )}
      
      {showTitle && (
        <Skeleton width="70%" height={24} className="mb-3" />
      )}
      
      {showText && (
        <SkeletonText lines={2} className="mb-4" />
      )}
      
      {showActions && (
        <div className="flex space-x-2">
          <Skeleton width={80} height={32} />
          <Skeleton width={80} height={32} />
        </div>
      )}
    </div>
  );
}

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
  showHeader?: boolean;
}

export function SkeletonTable({
  rows = 5,
  columns = 4,
  className = '',
  showHeader = true
}: SkeletonTableProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {showHeader && (
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-4">
            {Array.from({ length: columns }).map((_, index) => (
              <Skeleton
                key={index}
                width={index === 0 ? '30%' : '20%'}
                height={20}
              />
            ))}
          </div>
        </div>
      )}
      
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-4 py-3">
            <div className="flex space-x-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton
                  key={colIndex}
                  width={colIndex === 0 ? '30%' : '20%'}
                  height={16}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface SkeletonListProps {
  items?: number;
  className?: string;
  showAvatar?: boolean;
  showTitle?: boolean;
  showSubtitle?: boolean;
}

export function SkeletonList({
  items = 5,
  className = '',
  showAvatar = true,
  showTitle = true,
  showSubtitle = true
}: SkeletonListProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3">
          {showAvatar && (
            <Skeleton width={40} height={40} rounded="full" />
          )}
          
          <div className="flex-1 space-y-2">
            {showTitle && (
              <Skeleton width="60%" height={16} />
            )}
            
            {showSubtitle && (
              <Skeleton width="40%" height={14} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
