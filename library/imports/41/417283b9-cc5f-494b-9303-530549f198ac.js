"use strict";
cc._RF.push(module, '41728O5zF9JS5MDUwVJ8Zis', 'TestScene');
// Script/TestScene.js

'use strict';

// const debug = require('debug')('Billiards:TestScene');

var _require = require('./constants/LevelButtonState'),
    LOCKED = _require.LOCKED,
    CURRENT = _require.CURRENT,
    PASSED = _require.PASSED;

var c = 0;

cc.Class({
  extends: cc.Component,

  properties: {
    ball: cc.Node,
    layer0: cc.Node,
    layer1: cc.Node
  },

  onLoad: function onLoad() {},
  firstclick: function firstclick() {
    this.ball.removeFromParent(false);
    // this.layer0.addChild(this.ball);
  },
  secondclick: function secondclick() {
    this.ball.x = 20;
    this.ball.y = 20;

    // this.ball.removeFromParent(false);
    this.layer0.addChild(this.ball);
  }
});

cc._RF.pop();