import React, { useState, useEffect, useRef, useCallback } from 'react';
import Board from 'react-trello';
import { Button, Message } from '@alifd/next';
import styles from './index.module.scss';
import { Checkbox, Input, Form, Select, DatePicker } from '@alifd/next';
import cogoToast from 'cogo-toast';
import Dock from 'react-dock';
import SkyLight from 'react-skylight';
import G6 from '@antv/g6';
import insertCss from 'insert-css';
import { NodeTooltips, EdgeToolTips, NodeContextMenu } from './../'


export default function BoardList() {
  const debug = false; // 本机调试开关
  var host = "";
  if (debug) {
    host = "localhost";
  } else {
    host = "47.100.8.183"
  }

  // 控制report窗口可见
  const [isVisible, setIsVisible] = useState(false);
  // 控制log窗口可见
  const [isLogVisible, setIsLogVisible] = useState(false);
  const setVisible = () => {
    setIsVisible(true);
  };
  const setLogVisible = () => {
    setIsLogVisible(true);
  };
  const formItemLayout = {
    labelCol: {xxs: 7, s: 4, l: 3},
    wrapperCol: {xxs: 16, s: 10, l: 7},
  };
  // 这个函数有问题
  const checkMobile = (rule, values, callback) => {
    console.log(arguments);
    if (!values) {
      callback('请输入新密码');
    } else if (values.length < 8) {
      callback('密码必须大于8位');
    } else if (values.length > 16) {
      callback('密码必须小于16位');
    } else {
      callback();
    }
  };
  const validateAllFormField = (values, errors) => {
    console.log('error', errors, 'value', values);
    if (!errors) {
      // 提交当前填写的数据
    } else {
      // 处理表单报错
    }
  };
  const FormItem = Form.Item;
  const {Group: ButtonGroup} = Button;
  const [reportPath, setReportPath] = useState({});
  const [logPath, setLogPath] = useState({});
  const [mobile, setMobile] = useState("");
  const [fileName, setFileName] = useState("xxx@xxx.com");
  const [testcaseList, setTestcaseList] = useState([{value: "a", text: "aaa"}, {value: "b", text: "bbb"}, {
    value: "c",
    text: "ccc"
  }]);
  var [lane, setLane] = useState(1);
  const [card, setCard] = useState({});
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

  // 拉取所有task数据, 用以填充列表
  useEffect(() => {
    fetch(' http://' + host + ':9999/tasks/fetchall', {
      method: 'post',
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      // .then(() => data.log(response.json()))
      .then(data => {
        // 渲染编辑功能
        // for (var i = 0; i < data.lanes.length; i++) {
        //   data.lanes[i].cards = data.lanes[i].cards.map(_card => ({
        //     ..._card,
        //     label: <div onClick={() => editCard(_card)}>{_card.label}</div>
        //   }))
        // }
        // 设置data
        setData(data);
        console.log(data);

        // 绘制testcase流程图
        renderWorkFlow();

        if (data != null) {
          return Promise.resolve();
        } else {
          return Promise.reject();
        }
      })
      .then(() => cogoToast.success('加载卡片成功'))
      .catch(() => cogoToast.error('加载失败了，要么你开了代理，要么服务器跑丢了~'))
  }, []);

  // 拉取所有测试用例数据
  // useEffect(() => {
  //   fetch(' http://' + host + ':9999/tasks/fetchtestcases', {
  //     method: 'post',
  //     headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
  //     body: JSON.stringify(data)
  //   })
  //     .then(response => response.json())
  //     // .then(() => data.log(response.json()))
  //     .then(data => {
  //       setTestcaseList(data);
  //     })
  //     .then(() => cogoToast.success('加载用例集成功'))
  //     .catch(() => cogoToast.error('加载用例失败了，要么你开了代理，要么服务器跑丢了~'))
  // }, []);

  /**
   * Select 发生改变的时候触发的回调
   */
  const handleSelectChange = (value) => {
    // 设置提交的泳道
    setLane(value);
    console.log('handleSelectChange:', value);
  };

  /**
   * DatePicker 发生改变的时候触发的回调
   */
  const handleDatePickerChange = (value) => {
    console.log('handleDatePickerChange:', value);
  };

  // 提交一条line
  const submit = () => {
    cogoToast.loading('开始执行，请耐心等待....').then(
      () => {
        fetch(' http://' + host + ':9999/tasks/v1/refreshgeeks/'+fileName, {
          method: 'post',
          headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
          // body: JSON.stringify(data)
          body: JSON.stringify(mobile)
        })
          .then(response => response.json())
          // .then(() => data.log(response.json()))
          .then(data => {
            // setReportPath(data.reportPath);
            setLogPath(data.logPath);
            // setMobile(data.mobile);
            if (data.result === 'pass') {
              return Promise.resolve();
            } else {
              return Promise.reject();
            }
          })
          .then(() => {
              cogoToast.success('执行完成，请刷新页面');
              if (debug) {
                setIsLogVisible(true);
              }
            }
          )
          .catch(() => {
            cogoToast.success('执行失败，请重新获取cookie~');
            if (debug) {
              setIsLogVisible(true);
            }
          })
      }
    );
  };

  // 提交一条line
  const saveTasks = () => {
    fetch(' http://' + host + ':9999/tasks/v1/save/' + lane + "/" + fileName, {
      method: 'post',
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      // .then(() => data.log(response.json()))
      .then(data => {
        if (data.result === 'pass') {
          return Promise.resolve();
        } else {
          return Promise.reject();
        }
      })
      .then(() => {
          cogoToast.success('保存成功！');
        }
      )
      .catch(() => {
        cogoToast.success('保存失败，请调试~');
      })
  };

  // 获取已保存的testcase，并刷新界面
  const [testcase, setTestcase] = useState("请选择以保存的用例");
  const refreshTestcases = (val) => {
    setTestcase(val);
    fetch(' http://' + host + ':9999/tasks/v1/query/' + val, {
      method: 'post',
      headers: {'Accept': 'application/json', 'Content-Type': 'application/json',},
      body: ''
    })
      .then(response => response.json())
      // .then(() => data.log(response.json()))
      .then(data => {
        if (data !== null) {
          return Promise.resolve(data);
        } else {
          return Promise.reject();
        }
      })
      .then((data) => {
          cogoToast.success('获取成功！');
          console.log(data);
          setData(data);
        }
      )
      .catch(() => {
        cogoToast.success('获取失败，请调试~');
      })
  };

  // 合并lines并提交一条line
  const testLine = () => {
    cogoToast.loading('开始执行，请耐心等待....').then(() => {
      // 交换data里面的位置，做到和UI一致
      const tmpData = {...data};
      // 取出待移动的lane
      const allCards = data.lanes[parseInt(lane) + 1].cards.filter(card => card.id !== "");
      // 插入每个card
      allCards.map(v => tmpData.lanes[parseInt(lane)].cards.splice(tmpData.lanes[parseInt(lane)].cards.length, 0, v));
      // 移除每个card
      allCards.map(v => tmpData.lanes[parseInt(lane) + 1].cards = tmpData.lanes[parseInt(lane) + 1].cards.filter(card => card.id !== v.id));
      setData(tmpData);
      submit()
    });
  };

  // 开始拖动
  const handleDragStart = (cardId, laneId) => {
    console.log('开始拖拽:', cardId, laneId);
    // 把准备拖动的card放到内存里，用来拖动后的位置交换
    // if (card!=null) { 拖动泳道有闪退bug，再说
    setCard(data.lanes[laneId].cards.filter(card => card.id === cardId)[0]);
    // }

    console.log(card);
  };

  // 结束拖动
  const handleDragEnd = (cardId, sourceLaneId, targetLaneId, position) => {
    console.log('放开拖拽:', cardId, sourceLaneId, targetLaneId, position);
    // 拖拽完成，更改卡片自身laneId和position
    // 此处结构必须与服务端结构一致
    // 交换data里面的位置，做到和UI一致
    const tmpData = {...data};
    tmpData.lanes[sourceLaneId].cards = tmpData.lanes[sourceLaneId].cards.filter(card => card.id !== cardId)
    tmpData.lanes[targetLaneId].cards.splice(position, 0, {
      id: card.id,
      title: card.title,
      description: card.description,
      label: card.label,
      content: card.content
    });
    setData(tmpData);
    console.log(data);
  };

  const shouldReceiveNewData = (nextData) => {
    console.log("shouldReceiveNewData：" + nextData);
  };

  // 新增卡片的事件
  const handleCardAdd = (card, laneId) => {
    // 新卡片的id由控件生成
    console.log(`增加新卡片 ${card.id}`);

    const tmpData = {...data};
    // tmpData.lanes[sourceLaneId].cards = tmpData.lanes[sourceLaneId].cards.filter(card => card.id !== cardId)
    tmpData.lanes[laneId].cards.splice(tmpData.lanes[laneId].cards.length, 0, {
      id: card.id,
      title: card.title,
      description: card.description,
      label: card.label,
      content: ""
    });
    setData(tmpData);
    console.log(data);
  };

  // 卡片编辑窗口
  const cardWindow = useRef(null);
  // 卡片编辑控件
  const cardEditor = useRef(null);
  // 待编辑内容
  const [currentCardContent, setCurrentCardContent] = useState("")
  // 正在编辑的卡id
  const [currentCardId, setCurrentCardId] = useState({id: 0})

  // 打开卡片以便编辑
  const clickCard = (cardId, metadata, laneId) => {
    console.log("clickCard:" + cardId);

    setCurrentCardId({id: cardId});
    // 循环找到这张卡片
    for (var i = 0; i < data.lanes.length; i++) {
      const tmpCard = data.lanes[i].cards.filter(card => card.id === cardId);
      if (tmpCard.length != 0) {
        console.log(tmpCard[0]);
        // 重新获取这张卡片的content
        setCurrentCardContent(tmpCard[0].content);
      }
    }
    cardWindow.current.show();
  }
  // 保存卡片内容
  const saveCard = () => {
    console.log("saveCard:" + currentCardId.id);

    // 循环找到这张卡片
    for (var i = 0; i < data.lanes.length; i++) {
      for (var j = 0; j < data.lanes[i].cards.length; j++) {
        if (data.lanes[i].cards[j].id == currentCardId.id) {
          // 硬搜到这个卡片，找到他的position，以便更改后重写这个卡片
          var thisCardPosition = j;
          console.log("保存卡片内容：" + i + ":" + thisCardPosition);
          console.log(currentCardContent);

          const tmpCard = data.lanes[i].cards.filter(card => card.id === currentCardId.id);
          if (tmpCard.length != 0) {
            // 重新设置这张卡片的content
            const tmpData = {...data};
            tmpData.lanes[i].cards = tmpData.lanes[i].cards.filter(card => card.id !== currentCardId.id)
            tmpData.lanes[i].cards.splice(thisCardPosition, 0, {
              id: tmpCard[0].id,
              title: tmpCard[0].title,
              description: tmpCard[0].description,
              label: tmpCard[0].label,
              content: currentCardContent
            });
            setData(tmpData);
            console.log(data);
          }
        }
      }
    }
    cardWindow.current.hide();
  }

  // 编辑卡片的事件
  useEffect(() => {
    console.log('更新currentCardContent')
  }, [currentCardContent]);
  // 编辑器的样式
  var cardContentDialog = {
    backgroundColor: '#A9A9A9',
    color: '#000000',
    width: '70%',
    height: '600px',
    marginTop: '-300px',
    marginLeft: '-35%',
  };

  const [modelData, setModelData] = useState({
      "id": "初始位置",
      "children": [
        {
          "id": "1.0_用户登录(不要移除).yml",
          "title": "用户登录(不要移除)",
          "description": "1.0_用户登录(不要移除).yml",
          "label": "",
          "content": "\n- test:\n    api: api/登录/发送验证码.json # 登录态必须\n    \"name\": 发送验证码\n- test:\n    api: api/登录/验证码登录.json  # 登录态必须\n    \"name\": 验证码登录",
          "children": [
            {
              "id": "1.0.1_88VIP会员.yml",
              "title": "88VIP会员",
              "description": "9.1_88VIP会员.yml",
              "label": "",
              "content": "\n- test:\n    api: api/购买/88vip会员/88vip会员.json\n    \"name\": api/购买/88vip会员/88vip会员.json\n    variables:\n        begin_time: \"1578931200\"\n        end_time: \"1610553600\"\n        record_id: \"12345671\"\n          \n- test:\n    api: api/购买/88vip会员/88vip会员.json\n    \"name\": api/购买/88vip会员/88vip会员.json\n    variables:\n        begin_time: \"1610553600\"\n        end_time: \"1642089600\"\n        record_id: \"12345672\"",
              "children": [
                {
                  "id": "1.0.1.1_88VIP会员.yml",
                  "title": "88VIP会员",
                  "description": "9.1_88VIP会员.yml",
                  "label": "",
                  "content": "\n- test:\n    api: api/购买/88vip会员/88vip会员.json\n    \"name\": api/购买/88vip会员/88vip会员.json\n    variables:\n        begin_time: \"1578931200\"\n        end_time: \"1610553600\"\n        record_id: \"12345671\"\n          \n- test:\n    api: api/购买/88vip会员/88vip会员.json\n    \"name\": api/购买/88vip会员/88vip会员.json\n    variables:\n        begin_time: \"1610553600\"\n        end_time: \"1642089600\"\n        record_id: \"12345672\"",
                },
                {
                  "id": "1.0.1.2_88VIP会员.yml",
                  "title": "88VIP会员",
                  "description": "9.1_88VIP会员.yml",
                  "label": "",
                  "content": "\n- test:\n    api: api/购买/88vip会员/88vip会员.json\n    \"name\": api/购买/88vip会员/88vip会员.json\n    variables:\n        begin_time: \"1578931200\"\n        end_time: \"1610553600\"\n        record_id: \"12345671\"\n          \n- test:\n    api: api/购买/88vip会员/88vip会员.json\n    \"name\": api/购买/88vip会员/88vip会员.json\n    variables:\n        begin_time: \"1610553600\"\n        end_time: \"1642089600\"\n        record_id: \"12345672\"",
                  "children": [
                    {
                      "id": "1.0.1.2.1_88VIP会员.yml",
                      "title": "88VIP会员",
                      "description": "9.1_88VIP会员.yml",
                      "label": "",
                      "content": "\n- test:\n    api: api/购买/88vip会员/88vip会员.json\n    \"name\": api/购买/88vip会员/88vip会员.json\n    variables:\n        begin_time: \"1578931200\"\n        end_time: \"1610553600\"\n        record_id: \"12345671\"\n          \n- test:\n    api: api/购买/88vip会员/88vip会员.json\n    \"name\": api/购买/88vip会员/88vip会员.json\n    variables:\n        begin_time: \"1610553600\"\n        end_time: \"1642089600\"\n        record_id: \"12345672\"",

                    },
                    {
                      "id": "1.0.1.2.2_88VIP会员.yml",
                      "title": "88VIP会员",
                      "description": "9.1_88VIP会员.yml",
                      "label": "",
                      "content": "\n- test:\n    api: api/购买/88vip会员/88vip会员.json\n    \"name\": api/购买/88vip会员/88vip会员.json\n    variables:\n        begin_time: \"1578931200\"\n        end_time: \"1610553600\"\n        record_id: \"12345671\"\n          \n- test:\n    api: api/购买/88vip会员/88vip会员.json\n    \"name\": api/购买/88vip会员/88vip会员.json\n    variables:\n        begin_time: \"1610553600\"\n        end_time: \"1642089600\"\n        record_id: \"12345672\""
                    },
                    {
                      "id": "1.0.1.2.3_88VIP会员.yml",
                      "title": "88VIP会员",
                      "description": "9.1_88VIP会员.yml",
                      "label": "",
                      "content": "\n- test:\n    api: api/购买/88vip会员/88vip会员.json\n    \"name\": api/购买/88vip会员/88vip会员.json\n    variables:\n        begin_time: \"1578931200\"\n        end_time: \"1610553600\"\n        record_id: \"12345671\"\n          \n- test:\n    api: api/购买/88vip会员/88vip会员.json\n    \"name\": api/购买/88vip会员/88vip会员.json\n    variables:\n        begin_time: \"1610553600\"\n        end_time: \"1642089600\"\n        record_id: \"12345672\""
                    },
                    {
                      "id": "1.0.1.2.4_88VIP会员.yml",
                      "title": "88VIP会员",
                      "description": "9.1_88VIP会员.yml",
                      "label": "",
                      "content": "\n- test:\n    api: api/购买/88vip会员/88vip会员.json\n    \"name\": api/购买/88vip会员/88vip会员.json\n    variables:\n        begin_time: \"1578931200\"\n        end_time: \"1610553600\"\n        record_id: \"12345671\"\n          \n- test:\n    api: api/购买/88vip会员/88vip会员.json\n    \"name\": api/购买/88vip会员/88vip会员.json\n    variables:\n        begin_time: \"1610553600\"\n        end_time: \"1642089600\"\n        record_id: \"12345672\""
                    },
                    {
                      "id": "1.0.1.2.5_88VIP会员.yml",
                      "title": "88VIP会员",
                      "description": "9.1_88VIP会员.yml",
                      "label": "",
                      "content": "\n- test:\n    api: api/购买/88vip会员/88vip会员.json\n    \"name\": api/购买/88vip会员/88vip会员.json\n    variables:\n        begin_time: \"1578931200\"\n        end_time: \"1610553600\"\n        record_id: \"12345671\"\n          \n- test:\n    api: api/购买/88vip会员/88vip会员.json\n    \"name\": api/购买/88vip会员/88vip会员.json\n    variables:\n        begin_time: \"1610553600\"\n        end_time: \"1642089600\"\n        record_id: \"12345672\""
                    }
                  ]
                },
                {
                  "id": "1.0.1.3_88VIP会员.yml",
                  "title": "88VIP会员",
                  "description": "9.1_88VIP会员.yml",
                  "label": "",
                  "content": "\n- test:\n    api: api/购买/88vip会员/88vip会员.json\n    \"name\": api/购买/88vip会员/88vip会员.json\n    variables:\n        begin_time: \"1578931200\"\n        end_time: \"1610553600\"\n        record_id: \"12345671\"\n          \n- test:\n    api: api/购买/88vip会员/88vip会员.json\n    \"name\": api/购买/88vip会员/88vip会员.json\n    variables:\n        begin_time: \"1610553600\"\n        end_time: \"1642089600\"\n        record_id: \"12345672\""
                },
                {
                  "id": "1.0.1.4_88VIP会员.yml",
                  "title": "88VIP会员",
                  "description": "9.1_88VIP会员.yml",
                  "label": "",
                  "content": "\n- test:\n    api: api/购买/88vip会员/88vip会员.json\n    \"name\": api/购买/88vip会员/88vip会员.json\n    variables:\n        begin_time: \"1578931200\"\n        end_time: \"1610553600\"\n        record_id: \"12345671\"\n          \n- test:\n    api: api/购买/88vip会员/88vip会员.json\n    \"name\": api/购买/88vip会员/88vip会员.json\n    variables:\n        begin_time: \"1610553600\"\n        end_time: \"1642089600\"\n        record_id: \"12345672\""
                },
                {
                  "id": "1.0.1.5_88VIP会员.yml",
                  "title": "88VIP会员",
                  "description": "9.1_88VIP会员.yml",
                  "label": "",
                  "content": "\n- test:\n    api: api/购买/88vip会员/88vip会员.json\n    \"name\": api/购买/88vip会员/88vip会员.json\n    variables:\n        begin_time: \"1578931200\"\n        end_time: \"1610553600\"\n        record_id: \"12345671\"\n          \n- test:\n    api: api/购买/88vip会员/88vip会员.json\n    \"name\": api/购买/88vip会员/88vip会员.json\n    variables:\n        begin_time: \"1610553600\"\n        end_time: \"1642089600\"\n        record_id: \"12345672\""
                }
              ]
            },
            {
              "id": "1.0.2_88VIP会员.yml",
              "title": "88VIP会员",
              "description": "9.1_88VIP会员.yml",
              "label": "",
              "content": "\n- test:\n    api: api/购买/88vip会员/88vip会员.json\n    \"name\": api/购买/88vip会员/88vip会员.json\n    variables:\n        begin_time: \"1578931200\"\n        end_time: \"1610553600\"\n        record_id: \"12345671\"\n          \n- test:\n    api: api/购买/88vip会员/88vip会员.json\n    \"name\": api/购买/88vip会员/88vip会员.json\n    variables:\n        begin_time: \"1610553600\"\n        end_time: \"1642089600\"\n        record_id: \"12345672\""
            },
            {
              "id": "1.0.3_88VIP会员.yml",
              "title": "88VIP会员",
              "description": "9.1_88VIP会员.yml",
              "label": "",
              "content": "\n- test:\n    api: api/购买/88vip会员/88vip会员.json\n    \"name\": api/购买/88vip会员/88vip会员.json\n    variables:\n        begin_time: \"1578931200\"\n        end_time: \"1610553600\"\n        record_id: \"12345671\"\n          \n- test:\n    api: api/购买/88vip会员/88vip会员.json\n    \"name\": api/购买/88vip会员/88vip会员.json\n    variables:\n        begin_time: \"1610553600\"\n        end_time: \"1642089600\"\n        record_id: \"12345672\""
            },
            {
              "id": "1.0.4_88VIP会员.yml",
              "title": "88VIP会员",
              "description": "9.1_88VIP会员.yml",
              "label": "",
              "content": "\n- test:\n    api: api/购买/88vip会员/88vip会员.json\n    \"name\": api/购买/88vip会员/88vip会员.json\n    variables:\n        begin_time: \"1578931200\"\n        end_time: \"1610553600\"\n        record_id: \"12345671\"\n          \n- test:\n    api: api/购买/88vip会员/88vip会员.json\n    \"name\": api/购买/88vip会员/88vip会员.json\n    variables:\n        begin_time: \"1610553600\"\n        end_time: \"1642089600\"\n        record_id: \"12345672\""
            },
            {
              "id": "1.0.5_88VIP会员.yml",
              "title": "88VIP会员",
              "description": "9.1_88VIP会员.yml",
              "label": "",
              "content": "\n- test:\n    api: api/购买/88vip会员/88vip会员.json\n    \"name\": api/购买/88vip会员/88vip会员.json\n    variables:\n        begin_time: \"1578931200\"\n        end_time: \"1610553600\"\n        record_id: \"12345671\"\n          \n- test:\n    api: api/购买/88vip会员/88vip会员.json\n    \"name\": api/购买/88vip会员/88vip会员.json\n    variables:\n        begin_time: \"1610553600\"\n        end_time: \"1642089600\"\n        record_id: \"12345672\""
            }
          ]
        },
        {
          "id": "Consensus",
          "children": [
            {
              "id": "Models diversity",
              "children": [
                {"id": "Different initializations"},
                {"id": "Different parameter choices"},
                {"id": "Different architectures"},
                {"id": "Different modeling methods"},
                {"id": "Different training sets"},
                {"id": "Different feature sets"}
              ]
            },
            {
              "id": "Methods",
              "children": [
                {"id": "Classifier selection"},
                {"id": "Classifier fusion"}
              ]
            },
            {
              "id": "Common",
              "children": [
                {"id": "Bagging"},
                {"id": "Boosting"},
                {"id": "AdaBoost"}
              ]
            }
          ]
        },
        {
          "id": "Regression",
          "children": [
            {"id": "Multiple linear regression"},
            {"id": "Partial least squares"},
            {"id": "Multi-layer feedforward neural network"},
            {"id": "General regression neural network"},
            {"id": "Support vector regression"}
          ]
        }
      ]
    }
  )

  // tooltip 坐标
  const [showNodeTooltip, setShowNodeTooltip] = useState(false);
  const [nodeTooltipX, setNodeToolTipX] = useState(0);
  const [nodeTooltipY, setNodeToolTipY] = useState(0);

    // 节点ContextMenu坐标
  const [showNodeContextMenu, setShowNodeContextMenu] = useState(false)
  const [nodeContextMenuX, setNodeContextMenuX] = useState(0)
  const [nodeContextMenuY, setNodeContextMenuY] = useState(0)

  // 绘制整体工作流
  const renderWorkFlow = () => {
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
            // default: [{
            //   type: 'collapse-expand',
            //   onChange: function onChange(item, collapsed) {
            //     const data = item.get('model').data;
            //     data.collapsed = collapsed;
            //     return true;
            //   }
            // }, 'drag-canvas', 'zoom-canvas']
            default: ['drag-node', 'drag-canvas', {
              type: 'tooltip',
              formatText: function formatText(model) {
                const text = 'description: ' + model.description;
                return text;
              }
            },
              {
                type: 'tooltip',
                formatText(model) {
                  const text = 'label: ';
                  return text;
                },
                shouldUpdate: e => {
                  return true;
                }
              }]
          },
          defaultNode: {
            size: 30,
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
            rankSep: 100,
            preventOverlap: true
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

        graph.data(modelData);
        // graph.render();

        graph.fitView();

        // 设置当前graph对象
        setCurrentGraph(graph);

        graph.on('node:click', function (evt) {
          const node = evt.item;
          const model = node.getModel();
          model.oriLabel = model.label;
          // todo: 设置之前的node选择状态为false
          graph.findAllByState('node', 'active').forEach(node_i => {
            graph.setItemState(node_i, 'active', false);
            graph.updateItem(node, {
            label: model.id,
            labelCfg: {
              style: {
                fill: '#C6E5FF',
                stroke: '#5B8FF9'
              }
            }
          });
          });

          if (node.hasState('active')) {
            graph.setItemState(node, 'active', false);
            return;
          }
          graph.setItemState(node, 'active', true);
          graph.updateItem(node, {
            label: model.id,
            labelCfg: {
              style: {
                fill: '#003a8c',
                stroke: '#5B8FF9'
              }
            }
          });
          // 设置当前节点
          setCurrentNodeId(model.id);
          console.log("model.id" + model.id);
        });

        // 监听 node 上面 mouse 事件
        // graph.on('node:mouseenter', evt => {
        //   const { item } = evt;
        //   const model = item.getModel();
        //   const { x, y } = model;
        //   // todo: 位置不对
        //   // console.log(x);
        //   // console.log(y);
        //   console.log(model.content);
        //   const point = graph.getCanvasByPoint(x, y, model.content);
        //   // console.log(point);
        //
        //   setNodeToolTipX(point.x - 75);
        //   setNodeToolTipY(point.y + 15);
        //   setShowNodeTooltip(true);
        // });

        // 监听节点上面右键菜单事件
        graph.on('node:contextmenu', evt => {
          console.log("enter node:contextmenu");
          const { item } = evt
          const model = item.getModel()
          const { x, y } = model
          const point = graph.getCanvasByPoint(x, y)
          setNodeContextMenuX(point.x)
          setNodeContextMenuY(point.y)
          setShowNodeContextMenu(true)
        })

        // 节点上面触发 mouseleave 事件后隐藏 tooltip 和 ContextMenu
        graph.on('node:mouseleave', () => {
          // setShowNodeTooltip(false);
          // setShowNodeContextMenu(false);
        });
      });
  }



  // 当前选中节点
  const [currentNodeId, setCurrentNodeId] = useState(null);
  // 当前工作流视图对象，以便重绘
  const [currentGraph, setCurrentGraph] = useState(null);
  // 当前工作流变化计数器，以便是node id可以唯一
  var [workFlowChangedCount,setWorkFlowChangedCount] = useState(0);


  // 循环找到工作流中一个节点,并添加节点
  const find_and_add_Node = (_modelData, _new_card) => {
    // console.log("checking data:");
    // console.log(_modelData);

    console.log("checking node:" + _modelData.id)
    // 若有子节点在深度遍历
    // todo：最后子节点有bug
    if (_modelData.children !== undefined) {
      // console.log("passing children");
      // console.log(_modelData[i].children);
      for (var i = 0; i < _modelData.children.length; i++) {
        console.log(_modelData.children.length);
        _modelData.children.splice(i, 1, find_and_add_Node(_modelData.children[i], _new_card));
      }
    }
    if (_modelData.id === currentNodeId) {
      // 找到匹配节点则增加子节点
      console.log("found node:" + _modelData.id);
      console.log(_new_card);
      var _add_position = 0;
      if (_modelData.children !== undefined) {
        _add_position = _modelData.children.length;
      } else {
        _modelData.children = [];   // 最后的节点需要有children
      }
      setWorkFlowChangedCount(workFlowChangedCount++);
      _new_card.id = workFlowChangedCount + "_" + _new_card.id;
      _modelData.children.splice(_add_position, 1, _new_card);
      console.log(_modelData.children);

    }

    return _modelData;
  }

  // 动态添加一个节点
  const addNode = () =>{

    // 循环找到这张卡片
    for (var i = 0; i < data.lanes.length; i++) {
      for (var j = 0; j < data.lanes[i].cards.length; j++) {
        if (data.lanes[i].cards[j].id == currentCardId.id) {
          // 硬搜到这个卡片，找到他的position，以便更改后重写这个卡片
          var thisCardPosition = j;
          console.log("添加卡片到工作流：" + i + ":" + thisCardPosition);
          // console.log(currentCardContent);

          const tmpCard = data.lanes[i].cards.filter(card => card.id === currentCardId.id);
          if (tmpCard.length != 0) {
            tmpCard[0].content = currentCardContent;

            // 在工作流中找到定位节点，并添加子节点
            const new_modelData = find_and_add_Node(modelData, tmpCard[0]);
            console.log("new model data:");
            console.log(new_modelData);
            setModelData(new_modelData);

            // 重新渲染workflow
            currentGraph.render();
            currentGraph.fitView();
          }
        }
      }
    }
  }

  return (
    <div id="container" className={styles.boardList}>
      <SkyLight
        dialogStyles={cardContentDialog}
        hideOnOverlayClicked
        ref={cardWindow}
        // afterClose={_executeAfterModalClose}
        // afterOpen={_executeBeforeModalOpen}
        title={<p>
          {/*<Button*/}
          {/*  onClick={saveCard}*/}
          {/*  type="primary">*/}
          {/*  保存*/}
          {/*</Button>*/}
          {/*<Button*/}
          {/*  onClick={addNode}*/}
          {/*  type="primary">*/}
          {/*  添加至用例*/}
          {/*</Button>*/}
          <textarea ref={cardEditor} cols="100" rows="30"
                    value={currentCardContent}
                    onChange={(event) => setCurrentCardContent(event.target.value)}/>
          </p>}
      >

      </SkyLight>
      <h2 className={styles.formTitle}>Smart Hiring</h2>
      <FormItem
        label="cookie："
        {...formItemLayout}
        validator={checkMobile}
      >
        <Input
          name="mobileName"
          htmlType=""
          size="large"
          value={mobile}
          onChange={(value) => setMobile(value)}
        />
      </FormItem>
      请填写订阅邮箱地址：
      {/*<Select*/}
      {/*  size="small"*/}
      {/*  style={{width: '200px'}}*/}
      {/*  onChange={handleSelectChange}*/}
      {/*  defaultValue="1"*/}
      {/*>*/}
        {/*<Select.Option value="1">权益版</Select.Option>*/}
        {/*<Select.Option value="3">奖励金版</Select.Option>*/}
        {/*<Select.Option value="5">轻享版</Select.Option>*/}
      {/*</Select>*/}
      <Input
          name="fileName"
          htmlType=""
          size="large"Name
          value={fileName}
          onChange={(value) => setFileName(value)}
      />
      <ButtonGroup>
        <Button
          onClick={submit}
          type="primary">
          提交
        </Button>
        {/*<Button*/}
        {/*  onClick={testLine}*/}
        {/*  type="primary">*/}
        {/*  测试所有*/}
        {/*</Button>*/}
      </ButtonGroup>
      {/*<a onClick={setVisible}>（报告）</a>*/}
      {/*<a onClick={setLogVisible}>（日志）</a>*/}

      {/*<Button*/}
      {/*    onClick={saveTasks}*/}
      {/*    type="primary">*/}
      {/*    保存用例*/}
      {/*</Button>*/}
      {/*<Select*/}
      {/*  size="small"*/}
      {/*  style={{width: '200px'}}*/}
      {/*  onChange={refreshTestcases}*/}
      {/*  defaultValue="1"*/}
      {/*  value = {testcase}>*/}
      {/*    {*/}
      {/*      testcaseList.map((item,i) => {*/}
      {/*        return (*/}
      {/*          <option value={item.value}>{item.text}</option>*/}
      {/*        )*/}
      {/*      })*/}
      {/*    }*/}
      {/*>*/}
      {/*</Select>*/}
      <Board
        style={{background: '#BFBFBF', padding: '12px'}}
        data={data}
        draggable
        // collapsibleLanes
        handleDragStart={handleDragStart}
        handleDragEnd={handleDragEnd}
        onDataChange={shouldReceiveNewData}
        onCardAdd={handleCardAdd}
        editLaneTitle={true}
        allowRemoveCardz
        allowRemoveLane
        onCardClick={clickCard}
        editable
        addCardTitle="Add Item"
      />

      <Dock fluid='true' position='bottom' size="0.8" isVisible={isVisible}>
        <div onClick={() => setIsVisible(false)}>隐藏</div>
        <iframe src={reportPath} id="reportiframe" scrolling="yes" frameborder="0" width="100%" height="100%"></iframe>
      </Dock>
      <Dock fluid='true' position='right' size="0.8" isVisible={isLogVisible}>
        <div onClick={() => setIsLogVisible(false)}>隐藏</div>
        <iframe src={logPath} id="reportiframe" scrolling="yes" frameborder="0" width="100%" height="100%"></iframe>
      </Dock>

      {/*节点提示器*/}
      { showNodeTooltip && <NodeTooltips x={nodeTooltipX} y={nodeTooltipY} /> }
      { showNodeContextMenu && <NodeContextMenu x={nodeContextMenuX} y={nodeContextMenuY} /> }
    </div>
  );
}
