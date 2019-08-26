"use strict";
cc._RF.push(module, 'ef3a8+nWG5ByqorXH8cyJV0', 'GameState');
// Script/lib/GameState.js

'use strict';

var AdMob = require('AdMob');
exports.name = 'GameState';

exports.isFBInstantGame = !!window.FBInstant;
exports.iswechatgame = !!window.wx;
exports.istoutiaogame = !!window.tt;
exports.currentLevel = 1;
exports.playingLevel = 0;
exports.newtable = 0;
exports.anims = 0;
exports.clubstime = [0, 0, 0, 0, 0, 0, 0, 0];
exports.clubsget = [10, 10, 8, 8, 5, 5, 0, 0];
exports.club = 7;

exports.now_ball_in_hole = null;
// exports.ownlist = []; 
// exports.othlist = [];
// exports.PanchromaticBall = [1,2,3,4,5,6,7];//全色球
// exports.ColorBall = [9,10,11,12,13,14,15];//花色球


var EventEmitter = require("events").EventEmitter;
exports.events = new EventEmitter();

exports.options = {
  sound: 'on',
  music: 'on'
};

exports.platform = 'android google'; //xiaomi;  android google
exports.levelRank = [null];

exports.levels = require('levels');

exports.init = function () {
  var club = cc.sys.localStorage.getItem('club');
  if (club) {
    this.club = JSON.parse(club);
  } else {
    this.club = 7;
  }
  var clubs = cc.sys.localStorage.getItem('clubs');
  if (clubs) {
    this.clubstime = JSON.parse(clubs);
  } else {
    this.clubstime = [0, 0, 0, 0, 0, 0, 0, 0];
  }
  var nt = cc.sys.localStorage.getItem('newtable');
  if (nt) {
    this.newtable = JSON.parse(nt);
  } else {
    this.newtable = 0;
  }
  var cl = cc.sys.localStorage.getItem('currentLevel');
  if (cl) {
    this.currentLevel = JSON.parse(cl);
  } else {
    this.currentLevel = 1;
  }
  // this.currentLevel = 16;
  var lr = cc.sys.localStorage.getItem('levelRank');
  if (lr) {
    this.levelRank = JSON.parse(lr);
  } else {
    this.levelRank = [];
  }

  var user = cc.sys.localStorage.getItem('userData');
  if (user) {
    exports.userData = JSON.parse(user);

    if (this.userData.GooglePay === undefined) {
      this.userData.GooglePay = false;
    }

    if (this.userData.firstPlay === undefined) {
      this.userData.firstPlay = true;
    }

    // if(this.userData.newbieGuild === undefined){ 
    // this.userData.newbieGuild = true
    // }

    // console.log(this.userData)
  } else {
    exports.userData = {
      name: '',
      openId: '',
      GooglePay: false,
      firstPlay: true,
      newbieGuild: true
    };
  }

  return Promise.resolve();
};
exports.saveUserData = function () {
  cc.sys.localStorage.setItem('userData', JSON.stringify(this.userData));
};
exports.getFBInterstitial = function () {
  var _this = this;

  console.log('getFBInterstitial-----');
  if (!this.fbInterstitial) {
    FBInstant.getInterstitialAdAsync('298471817559434_298473940892555').then(function (interstitial) {
      _this.fbInterstitial = interstitial;
      return interstitial.loadAsync();
    }).catch(function (err) {
      // ignore error
      console.log('ERROR: ' + JSON.stringify(err));
    });
  } else {
    this.fbInterstitial.loadAsync().then(function () {
      console.log('插屏加载成功');
    });
  }
};

exports.showFBInterstitial = function () {
  console.log('showFBInterstitial-----');
  if (this.fbInterstitial) {
    var interstitial = this.fbInterstitial;

    this.getFBInterstitial();

    return interstitial.showAsync().then(function () {}).catch(function (err) {
      // ignore error
      console.error('log: ' + JSON.stringify(err));
    });
  } else {
    this.getFBInterstitial();
    return Promise.resolve();
  }
};

exports.initFBVideo = function () {
  var _this2 = this;

  console.log('initFBVideo-----');
  FBInstant.getInterstitialAdAsync('298471817559434_333738157366133').then(function (video) {
    _this2.fbVideo = video;

    return video.loadAsync().then(function () {
      AdMob.FaceBookEventValue('initFBVideo');
      // JavaCallBack('onRewardedVideoAdLoaded')
      // this.showFBVideo()
    });
  }).catch(function (err) {
    // this.getFBVideo();
    // ignore error
    console.log('ERROR: ' + JSON.stringify(err));
  });
};
exports.getFBVideo = function () {
  var _this3 = this;

  console.log('getFBVideo2-----');
  this.fbVideo.loadAsync().then(function () {
    JavaCallBack('onRewardedVideoAdLoaded');
    AdMob.FaceBookEventValue('getFBVideo');
    _this3.showFBVideo();
  }).catch(function (err) {
    JavaCallBack('noAds');
    // this.getFBVideo();
    // ignore error
    console.log('ERROR: ' + JSON.stringify(err));
  });
};

exports.showFBVideo = function () {
  console.log('showFBVideo-----');
  if (this.fbVideo) {
    var video = this.fbVideo;
    // this.fbVideo = null;


    return video.showAsync().then(function () {
      JavaCallBack('onRewarded');
      AdMob.FaceBookEventValue('onRewarded');
    }).catch(function (err) {
      JavaCallBack('noAds');
      // ignore error
      console.log('ERROR: ' + JSON.stringify(err));
    });
  } else {

    return Promise.resolve();
  }
};

exports._t = Date.now();

exports.setT = function () {
  exports._t = Date.now();
};

exports.logT = function (label) {
  label = label || '';
  if (label) {
    console.log('T (' + label + '):', Date.now() - this._t);
  } else {
    console.log('T:', Date.now() - this._t);
  }
  this.setT();
};

exports.shootBallConfig = {
  angle: 0,
  distance: 0,
  power: 0
};

cc._RF.pop();