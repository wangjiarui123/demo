(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/constants/PoolTableConf.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '0e7f62kjklLw6Jj69RpMr+I', 'PoolTableConf', __filename);
// Script/constants/PoolTableConf.js

'use strict';

var _require = require('./ColliderTags'),
    CUSHION = _require.CUSHION,
    POCKET_WRAP = _require.POCKET_WRAP,
    SLATE_WRAP = _require.SLATE_WRAP,
    POCKET_TRIGGER = _require.POCKET_TRIGGER,
    BALL_GUIDE_SENSOR = _require.BALL_GUIDE_SENSOR;

/**
 * Horizontal cushion width
 */


var hw = 333;

/**
 * Horizontal cushion width
 */
var hh = 64;

/**
 * Horizontal cushion x
 */
var hx = 223.5;

/**
 * Horizontal cushion x
 */
var hy = 248;

var hr = hh * 0.5;

/**
 * Vertical cushion x
 */
var vx = 464.5;

/**
 * Vertical cushion x
 */
var vy = 0;

/**
 * Horizontal cushion width
 */
var vw = 64;

/**
 * Horizontal cushion width
 */
var vh = 346;

var vr = vw * 0.5;

var cushions = [{ shape: 'box', width: hw, height: hh, x: hx, y: hy, tag: CUSHION, dir: 'h' }, { shape: 'circle', radius: hr, x: hx - hw * 0.5, y: hy, tag: CUSHION }, { shape: 'circle', radius: hr, x: hx + hw * 0.5, y: hy, tag: CUSHION }, { shape: 'box', width: hw, height: hh, x: hx, y: -hy, tag: CUSHION, dir: 'h' }, { shape: 'circle', radius: hr, x: hx - hw * 0.5, y: -hy, tag: CUSHION }, { shape: 'circle', radius: hr, x: hx + hw * 0.5, y: -hy, tag: CUSHION }, { shape: 'box', width: hw, height: hh, x: -hx, y: -hy, tag: CUSHION, dir: 'h' }, { shape: 'circle', radius: hr, x: -(hx - hw * 0.5), y: -hy, tag: CUSHION }, { shape: 'circle', radius: hr, x: -(hx + hw * 0.5), y: -hy, tag: CUSHION }, { shape: 'box', width: hw, height: hh, x: -hx, y: hy, tag: CUSHION, dir: 'h' }, { shape: 'circle', radius: hr, x: -(hx - hw * 0.5), y: hy, tag: CUSHION }, { shape: 'circle', radius: hr, x: -(hx + hw * 0.5), y: hy, tag: CUSHION }, { shape: 'box', width: vw, height: vh, x: vx, y: vy, tag: CUSHION, dir: 'v' }, { shape: 'circle', radius: vr, x: vx, y: vy + vh * 0.5, tag: CUSHION }, { shape: 'circle', radius: vr, x: vx, y: vy - vh * 0.5, tag: CUSHION }, { shape: 'box', width: vw, height: vh, x: -vx, y: vy, tag: CUSHION, dir: 'v' }, { shape: 'circle', radius: vr, x: -vx, y: -(vy + vh * 0.5), tag: CUSHION }, { shape: 'circle', radius: vr, x: -vx, y: -(vy - vh * 0.5), tag: CUSHION }];

var pockets = [{
  shape: 'polygon',
  x: 0,
  y: 246,
  points: [{ x: -29.1, y: 0 }, { x: -28.2, y: 9 }, { x: -24.65, y: 16.42 }, { x: -19.52, y: 21.97 }, { x: -13.13, y: 26.32 }, { x: -6, y: 29 }, { x: 6, y: 29 }, { x: 13.13, y: 26.32 }, { x: 19.52, y: 21.97 }, { x: 24.65, y: 16.42 }, { x: 28.2, y: 9 }, { x: 29.1, y: 0 }, { x: 40, y: 0 }, { x: 40, y: 40 }, { x: -40, y: 40 }, { x: -40, y: 0 }],
  tag: POCKET_WRAP
}, {
  shape: 'polygon',
  x: 0,
  y: -246,
  points: [{ x: -29.1, y: -0 }, { x: -28.2, y: -9 }, { x: -24.65, y: -16.42 }, { x: -19.52, y: -21.97 }, { x: -13.13, y: -26.32 }, { x: -6, y: -29 }, { x: 6, y: -29 }, { x: 13.13, y: -26.32 }, { x: 19.52, y: -21.97 }, { x: 24.65, y: -16.42 }, { x: 28.2, y: -9 }, { x: 29.1, y: 0 }, { x: 40, y: 0 }, { x: 40, y: -40 }, { x: -40, y: -40 }, { x: -40, y: 0 }],
  tag: POCKET_WRAP
}, {
  shape: 'polygon',
  x: 443.5,
  y: 226,
  points: [{ "x": 8.48528137423857, "y": -28.284271247461902 }, { "x": 17.960512242138304, "y": -22.627416997969522 }, { "x": 22.910259710444137, "y": -18.526197667087548 }, { "x": 27.082189719444766, "y": -13.08147545195113 }, { "x": 29.55706345359768, "y": -5.515432893255071 }, { "x": 30.264170234784228, "y": 2.404163056034263 }, { "x": 28.92066735052979, "y": 9.82878425849301 }, { "x": 25.880108191427638, "y": 16.687720036002524 }, { "x": 21.920310216782973, "y": 21.920310216782976 }, { "x": 16.68772003600252, "y": 25.88010819142764 }, { "x": 9.828784258493009, "y": 28.920667350529794 }, { "x": 2.404163056034263, "y": 30.264170234784235 }, { "x": -5.5154328932550705, "y": 29.557063453597685 }, { "x": -13.081475451951128, "y": 27.08218971944477 }, { "x": -18.526197667087544, "y": 22.91025971044414 }, { "x": -22.62741699796952, "y": 17.960512242138307 }, { "x": -28.2842712474619, "y": 8.485281374238571 }, { "x": -38.18376618407356, "y": 18.38477631085024 }, { "x": 0, "y": 56.568542494923804 }, { "x": 56.5685424949238, "y": 0 }, { "x": 18.384776310850235, "y": -38.18376618407357 }],
  tag: POCKET_WRAP
}, {
  shape: 'polygon',
  x: 443.5,
  y: -226,
  points: [{ "x": 8.485281374238571, "y": 28.2842712474619 }, { "x": 17.960512242138307, "y": 22.62741699796952 }, { "x": 22.91025971044414, "y": 18.526197667087544 }, { "x": 27.08218971944477, "y": 13.081475451951128 }, { "x": 29.557063453597685, "y": 5.5154328932550705 }, { "x": 30.264170234784235, "y": -2.404163056034263 }, { "x": 28.920667350529794, "y": -9.828784258493009 }, { "x": 25.88010819142764, "y": -16.68772003600252 }, { "x": 21.920310216782976, "y": -21.920310216782973 }, { "x": 16.687720036002524, "y": -25.880108191427638 }, { "x": 9.82878425849301, "y": -28.92066735052979 }, { "x": 2.404163056034263, "y": -30.264170234784228 }, { "x": -5.515432893255071, "y": -29.55706345359768 }, { "x": -13.08147545195113, "y": -27.082189719444766 }, { "x": -18.526197667087548, "y": -22.910259710444137 }, { "x": -22.627416997969522, "y": -17.960512242138304 }, { "x": -28.284271247461902, "y": -8.48528137423857 }, { "x": -38.18376618407357, "y": -18.384776310850235 }, { "x": 0, "y": -56.5685424949238 }, { "x": 56.568542494923804, "y": 0 }, { "x": 18.38477631085024, "y": 38.18376618407356 }],
  tag: POCKET_WRAP
}, {
  shape: 'polygon',
  x: -443.5,
  y: -226,
  points: [{ "x": -8.485281374238571, "y": 28.2842712474619 }, { "x": -17.960512242138307, "y": 22.62741699796952 }, { "x": -22.91025971044414, "y": 18.526197667087544 }, { "x": -27.08218971944477, "y": 13.081475451951128 }, { "x": -29.557063453597685, "y": 5.5154328932550705 }, { "x": -30.264170234784235, "y": -2.404163056034263 }, { "x": -28.920667350529794, "y": -9.828784258493009 }, { "x": -25.88010819142764, "y": -16.68772003600252 }, { "x": -21.920310216782976, "y": -21.920310216782973 }, { "x": -16.687720036002524, "y": -25.880108191427638 }, { "x": -9.82878425849301, "y": -28.92066735052979 }, { "x": -2.404163056034263, "y": -30.264170234784228 }, { "x": 5.515432893255071, "y": -29.55706345359768 }, { "x": 13.08147545195113, "y": -27.082189719444766 }, { "x": 18.526197667087548, "y": -22.910259710444137 }, { "x": 22.627416997969522, "y": -17.960512242138304 }, { "x": 28.284271247461902, "y": -8.48528137423857 }, { "x": 38.18376618407357, "y": -18.384776310850235 }, { "x": 0, "y": -56.5685424949238 }, { "x": -56.568542494923804, "y": 0 }, { "x": -18.38477631085024, "y": 38.18376618407356 }],
  tag: POCKET_WRAP
}, {
  shape: 'polygon',
  x: -443.5,
  y: 226,
  points: [{ "x": -8.48528137423857, "y": -28.284271247461902 }, { "x": -17.960512242138304, "y": -22.627416997969522 }, { "x": -22.910259710444137, "y": -18.526197667087548 }, { "x": -27.082189719444766, "y": -13.08147545195113 }, { "x": -29.55706345359768, "y": -5.515432893255071 }, { "x": -30.264170234784228, "y": 2.404163056034263 }, { "x": -28.92066735052979, "y": 9.82878425849301 }, { "x": -25.880108191427638, "y": 16.687720036002524 }, { "x": -21.920310216782973, "y": 21.920310216782976 }, { "x": -16.68772003600252, "y": 25.88010819142764 }, { "x": -9.828784258493009, "y": 28.920667350529794 }, { "x": -2.404163056034263, "y": 30.264170234784235 }, { "x": 5.5154328932550705, "y": 29.557063453597685 }, { "x": 13.081475451951128, "y": 27.08218971944477 }, { "x": 18.526197667087544, "y": 22.91025971044414 }, { "x": 22.62741699796952, "y": 17.960512242138307 }, { "x": 28.2842712474619, "y": 8.485281374238571 }, { "x": 38.18376618407356, "y": 18.38477631085024 }, { "x": 0, "y": 56.568542494923804 }, { "x": -56.5685424949238, "y": 0 }, { "x": -18.384776310850235, "y": -38.18376618407357 }],
  tag: POCKET_WRAP
}];

exports.cushions = cushions;
exports.cushionDensity = 1;
exports.cushionFriction = 0;
exports.cushionRestitution = 0.3;

exports.pockets = pockets;
exports.pocketDensity = 1;
exports.pocketFriction = 0;
exports.pocketRestitution = 0.3;

exports.ballRadius = 16;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=PoolTableConf.js.map
        