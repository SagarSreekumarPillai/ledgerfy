// FILE: /components/charts/BarChart.tsx
'use client';

import React from 'react';

interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarChartData[];
  title?: string;
  height?: number;
  className?: string;
  showValues?: boolean;
  showGrid?: boolean;
  animate?: boolean;
}

export function BarChart({
  data,
  title,
  height = 300,
  className = '',
  showValues = true,
  showGrid = true,
  animate = true
}: BarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  const defaultColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ];

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      {title && (
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">{title}</h3>
      )}
      
      <div className="relative" style={{ height }}>
        {/* Grid lines */}
        {showGrid && (
          <div className="absolute inset-0 flex flex-col justify-between">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="border-t border-gray-200 dark:border-gray-600"
                style={{ top: `${(index / 4) * 100}%` }}
              />
            ))}
          </div>
        )}

        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500">
          {Array.from({ length: 5 }).map((_, index) => {
            const value = maxValue - (index / 4) * range;
            return (
              <span key={index} className="transform -translate-y-1/2">
                {value.toLocaleString()}
              </span>
            );
          })}
        </div>

        {/* Bars */}
        <div className="ml-16 h-full flex items-end space-x-2">
          {data.map((item, index) => {
            const heightPercentage = range > 0 ? ((item.value - minValue) / range) * 100 : 50;
            const color = item.color || defaultColors[index % defaultColors.length];
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full rounded-t"
                  style={{
                    height: `${heightPercentage}%`,
                    backgroundColor: color,
                    transition: animate ? 'height 0.6s ease-out' : 'none',
                    animationDelay: animate ? `${index * 0.1}s` : '0s'
                  }}
                />
                
                {/* X-axis label */}
                <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 text-center">
                  {item.label}
                </div>
                
                {/* Value above bar */}
                {showValues && (
                  <div className="text-xs font-medium text-gray-900 dark:text-gray-100 mt-1">
                    {item.value.toLocaleString()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface HorizontalBarChartProps {
  data: BarChartData[];
  title?: string;
  height?: number;
  className?: string;
  showValues?: boolean;
  showGrid?: boolean;
  animate?: boolean;
}

export function HorizontalBarChart({
  data,
  title,
  height = 300,
  className = '',
  showValues = true,
  showGrid = true,
  animate = true
}: HorizontalBarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  const defaultColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ];

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      {title && (
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">{title}</h3>
      )}
      
      <div className="space-y-3">
        {data.map((item, index) => {
          const widthPercentage = range > 0 ? ((item.value - minValue) / range) * 100 : 50;
          const color = item.color || defaultColors[index % defaultColors.length];
          
          return (
            <div key={index} className="flex items-center space-x-3">
              {/* Label */}
              <div className="w-24 text-sm text-gray-600 dark:text-gray-400 truncate">
                {item.label}
              </div>
              
              {/* Bar container */}
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative">
                {/* Bar */}
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${widthPercentage}%`,
                    backgroundColor: color,
                    transition: animate ? 'width 0.6s ease-out' : 'none',
                    animationDelay: animate ? `${index * 0.1}s` : '0s'
                  }}
                />
                
                {/* Value */}
                {showValues && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-white">
                      {item.value.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
