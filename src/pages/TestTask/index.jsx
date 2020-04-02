import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import G6 from '@antv/g6';
import Board from 'react-trello';


export default function() {
  var [data, setData] = useState({
    lanes: [
      {
        id: '1',
        label: '',
        title: '出错了',
        cards: [
          {
            id: '1.1',
            title: '无法加载服务器资源',
            description: '',
            label: '',
          }
        ],
      }
    ],
  });

  useEffect(()=> {
      fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/algorithm-category.json')
        .then(res => res.json())
        .then(data => {
          const width = document.getElementById('container').scrollWidth;
          const height = document.getElementById('container').scrollHeight || 1000;
          const graph = new G6.TreeGraph({
            container: 'container',
            width,
            height,
            pixelRatio: 2,
            modes: {
              default: [{
                type: 'collapse-expand',
                onChange: function onChange(item, collapsed) {
                  const data = item.get('model').data;
                  data.collapsed = collapsed;
                  return true;
                }
              }, 'drag-canvas', 'zoom-canvas']
            },
            defaultNode: {
              size: 26,
              anchorPoints: [[0, 0.5], [1, 0.5]],
              style: {
                fill: '#C6E5FF',
                stroke: '#5B8FF9'
              }
            },
            defaultEdge: {
              shape: 'cubic-horizontal',
              style: {
                stroke: '#A3B1BF'
              }
            },
            layout: {
              type: 'dendrogram',
              direction: 'LR', // H / V / LR / RL / TB / BT
              nodeSep: 30,
              rankSep: 100
            }
          });

          graph.node(function (node) {
            return {
              label: node.id,
              labelCfg: {
                position: node.children && node.children.length > 0 ? 'left' : 'right',
                offset: 5
              }
            };
          });

          graph.data(data);
          graph.render();
          graph.fitView();
        });
    }
  )

  return (
	 	<div id="container" >
        <Board
        style={{background: '#BFBFBF', padding: '12px'}}
        data={data}
        draggable
        editable
        addCardTitle="Add Item"
      />
    </div>
	 )
}
