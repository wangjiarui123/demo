'use strict';

// const debug = require('debug')('Billiards:TestScene');
const { LOCKED, CURRENT, PASSED } = require('./constants/LevelButtonState');

let c = 0;

cc.Class({
  extends: cc.Component,

  properties: {
    ball:cc.Node,
    layer0:cc.Node,
    layer1:cc.Node,
  },

  onLoad() {

 

  },
  firstclick(){
    this.ball.removeFromParent(false);
    // this.layer0.addChild(this.ball);
  },

  secondclick(){
    this.ball.x =20;
    this.ball.y =20;

    // this.ball.removeFromParent(false);
    this.layer0.addChild(this.ball);
  },

});
