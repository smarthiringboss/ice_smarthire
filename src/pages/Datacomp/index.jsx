import React, { Component } from 'react';
import GridLayout from './components/GridLayout';

export default function() {
  return (
    <div className="Datacomp-page">
      {/* 可拖拽和调整大小的网格布局 */}
      <GridLayout />
    </div>
  );
}
