import React, { Component } from 'react';
import BoardList from './components/BoardList';
import FilterBar from './components/FilterBar';

export default function() {
  return (
    <div className="Datatask-page">
      {/* TODO 任务管理面板，可拖拽排序 */}
      <BoardList editable={true} />

    </div>
  );
}
