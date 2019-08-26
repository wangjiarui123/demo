
const gs = require('GameState');
const test = require('test');
const disableAdMob = true;
 
const AppActivity = 'org/cocos2dx/javascript/AppActivity'
// const AppActivity = 'org/cocos2dx/javascript/AppActivity_MI'
var admobData = {
        "interstitial_start_enabled" :"Yes",
        "interstitial_win_enabled" :"Yes",
        "interstitial_win_home" :"Yes",
        "interstitial_win_refresh" :"Yes",
        "interstitial_lose_home" :"Yes",
        "interstitial_lose_refresh" :"Yes",
        "interstitial_back_home" : "Yes",
        "interstitial_enabled" :"Yes",
        "banner_enabled" :"Yes",
    }
const AdMob = {
  enabled: !disableAdMob && cc.sys.isNative && cc.sys.os === cc.sys.OS_ANDROID,
  IOS: !disableAdMob && cc.sys.isNative && cc.sys.os === cc.sys.OS_IOS,
  initialized: false,
  loadedAds: false,

  init() {
    // this.FaceBookEvent('versionCode:1.0.1') //mi
     
    // this.FaceBookEvent('versionCode:1.1.3')   //android ios
    // this.FaceBookEvent('AdmobInit');
    window.FireBaseConfig = (data) => {
      console.log("configData::::",data)
      if(!data) 
        data = "Yes*Yes*Yes*Yes*Yes*Yes*Yes*Yes*Yes";
      /* 
       *  interstitial_start_enabled
       *  interstitial_win_enabled
       *  interstitial_win_home
       *  interstitial_win_refresh
       *  interstitial_lose_home
       *  interstitial_lose_refresh
       *  interstitial_back_home
       *  interstitial_enabled
       *  banner_enabled
       * data = "Yes*Yes*Yes*Yes*Yes*Yes*Yes*Yes*Yes"
      */
      
      data = data.split("*")

      admobData = {
        "interstitial_start_enabled" :data[0],
        "interstitial_win_enabled" :data[1],
        "interstitial_win_home" :data[2],
        "interstitial_win_refresh" :data[3],
        "interstitial_lose_home" :data[4],
        "interstitial_lose_refresh" :data[5],
        "interstitial_back_home" :data[6],
        "interstitial_enabled" :data[7],
        "banner_enabled" :data[8],
      }
        
      if (this.enabled) { 
        if(!gs.userData.firstPlay){
            AdMob.ShowInterstitialAd("interstitial_start_enabled")
        }else{
            gs.userData.firstPlay = false;
            gs.saveUserData();
        }
      }
    }
    
    window.JavaCallBack = (id) => {
        switch (id) {
          case 'onRewardedVideoAdLoaded':
            this.loadedAds = true;
            console.log("源程序中onRewardedVideoAdLoaded")
            break;
          case 'onRewarded': 
            if (this.onRewarded) { this.onRewarded(); }
            this.loadedAds = false;
            break;
          case 'onRewardedVideoAdOpened':
          case 'onRewardedVideoAdClosed':
          case 'onRewardedVideoAdFail':
          case 'noAds':
            this.loadedAds = false;
            if (gs.isFBInstantGame){
              gs.events.emit('show-task-text',{text: 'noAds!'} )
            }
            break;
          case 'noInterstitialAds':
            console.log('没有插屏广告')
            this.LoadInterstitialAd();
            break;
          case 'loadedInterstitialAds':
            console.log('插屏广告加载成功')
            break;
          case 'InterstitialAdsClose':
            
            console.log('插屏广告关闭ios')
            break;
          case 'InterstitialAdsClick':
             
            console.log('插屏广告被点击ios')
            break;
          case 'osIosPaySuccess':
          case 'onGooglePlayPaySuccess':
            // console.log('支付成功')
            gs.userData.GooglePay = true;
            gs.saveUserData();
            gs.events.emit('show-task-text',{text: 'Pay Success !'} )
            gs.events.emit('hide-pay-btn')
            this.HideBannerAd()
            this.HideBannerAd2()
            this.fireBaseLogEvent('onGooglePlayPaySuccess',gs.currentLevel)
            break;
          case 'onIosPayError':
          case 'onIosPlayPayLongTime':
          case 'onGooglePlayPayFail':
            // console.log('支付失败')
            gs.events.emit('show-task-text',{text: 'Pay Failed !'} )
            this.fireBaseLogEvent('onGooglePlayPayFail',gs.currentLevel)
            break;
          case 'onGooglePlayPayCancel':
            // console.log('支付取消')
            this.fireBaseLogEvent('onGooglePlayPayCancel',gs.currentLevel)
            break;
          case 'onIosPlayPayOwend':
          case 'onGooglePlayPayOwend':
            gs.userData.GooglePay = true;
            gs.saveUserData();
            gs.events.emit('show-task-text',{text: 'Pay Success !'} )
            gs.events.emit('hide-pay-btn')
            this.HideBannerAd()
            this.HideBannerAd2()
            this.fireBaseLogEvent('onGooglePlayPayOwend',gs.currentLevel)
            break;
          case 'onGooglePlayPayError':
            //没有google 框架 或者 vpn 链接失败
            this.fireBaseLogEvent('onGooglePlayPayError',gs.currentLevel)
            gs.events.emit('show-task-text',{text: 'Not Google PLay Server.  Or  Connection is Failed!'} )
            break;
          case 'onGooglePlayPayError':
             
            break;
          
        }
    };
     
    if (this.enabled) { 

        if(!gs.userData.firstPlay){
          setTimeout(()=>{
            if(admobData){
              AdMob.ShowInterstitialAd("interstitial_start_enabled")
            }
          },200)
          
        }else{
          gs.userData.firstPlay = false;
          gs.saveUserData();
        }
        console.log("已经初始化")
        jsb.reflection.callStaticMethod(
          AppActivity,
          'initAdmob',
          '()V'
        );
        if (gs.userData.GooglePay || gs.userData.newbieGuild) {
            this.HideBannerAd2()
            this.HideBannerAd()
        }     

    }else if( this.IOS ){
      console.log('************init IOS SDK***************')
      
      window.testMethod=(str)=>{
          console.log(' testMethod222222222' , str)
          // return 'abcd'
      }

      let ret = jsb.reflection.callStaticMethod(
          "ATWrapper",
          "initADTiming:title:",
          "title",
          "message"
        );
      
      if(!gs.userData.firstPlay){
        setTimeout(()=>{
            AdMob.ShowInterstitialAd("interstitial_start_enabled")
        },2000)
      }else{
        gs.userData.firstPlay = false;
        gs.saveUserData();
      }

      console.log("oc 返回：：：",ret)

    }else if (gs.isFBInstantGame){
      gs.getFBInterstitial();
      gs.initFBVideo();
    }else if (gs.istoutiaogame){
      this.toutiaoRewardVideo = wx.createRewardedVideoAd({adUnitId: '7noiv5a6rl5olfg91q'});
      //
      const {
        windowWidth,
        windowHeight,
    } = tt.getSystemInfoSync();
    var targetBannerAdWidth = 150;
    
    // 创建一个居于屏幕底部正中的广告
    this.toutiaoBannerAd = tt.createBannerAd({
        adUnitId: 'ikm5agh0cc12h9fk81',
        style: {
            width: targetBannerAdWidth,
            top: windowHeight - (targetBannerAdWidth / 16 * 9), // 根据系统约定尺寸计算出广告高度
        },
    });
    // 也可以手动修改属性以调整广告尺寸
    this.toutiaoBannerAd.style.left = (windowWidth - targetBannerAdWidth) / 2;
    
    // 尺寸调整时会触发回调
    // 注意：如果在回调里再次调整尺寸，要确保不要触发死循环！！！
    this.toutiaoBannerAd.onResize(size => {
        console.log(size.width, size.height);
    
        // 如果一开始设置的 banner 宽度超过了系统限制，可以在此处加以调整
        if (targetBannerAdWidth != size.width) {
            targetBannerAdWidth = size.width;
            this.toutiaoBannerAd.style.top = windowHeight - (res.width / 16 * 9);
            this.toutiaoBannerAd.style.left = (windowWidth - res.width) / 2;
        }
    });
      //

      tt.onShow(()=>{   
        AudioPlayer.bgmSwitch(false);
        console.log("showvoice");

        });
      tt.onHide(()=>{
        AudioPlayer.timelose(true);
        AudioPlayer.bgmSwitch(true);
        console.log("hidevoice");
      });
    }else if(gs.iswechatgame){
      //////////////////////////
      this.wechatRewardVideo = wx.createRewardedVideoAd({adUnitId: 'adunit-a9aba00fe338894e'});
        const {
          windowWidth,
          windowHeight,
      } = wx.getSystemInfoSync();
    var wechatBannerAdWidth = 300;
      this.wechatBannerAd = wx.createBannerAd({adUnitId: 'adunit-87329696c552b88e',
      style: {
        width: wechatBannerAdWidth,
        left:(windowWidth-wechatBannerAdWidth)/2,
        top: windowHeight - 105, // 根据系统约定尺寸计算出广告高度
    },});

      this.interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-671e5f61fd8d76a3'
      })




      wx.onShow(()=>{   
        AudioPlayer.bgmSwitch(false);
        console.log("showvoice");
  
        
      });
      wx.onHide(()=>{
        AudioPlayer.timelose(true);
        AudioPlayer.bgmSwitch(true);
        console.log("hidevoice");
      });
      
    }

      
  },

  LoadBannerAd(t) {
    console.log('banner---------------------')
    console.log('gs.userData.GooglePay',gs.userData.GooglePay)
    console.log(admobData.banner_enabled)
    console.log('banner---------------------')
    if (gs.userData.GooglePay) {
      this.HideBannerAd2()
      this.HideBannerAd()
      return;
    }

    if(admobData){
      if(admobData.banner_enabled == 'No'){
        this.HideBannerAd2()
        this.HideBannerAd()
        return;
      } 
    }
    
    if (this.enabled ) {  
      // console.log("第一位")
      let type = jsb.reflection.callStaticMethod(
        AppActivity,
        'LoadBannerAd',
        '()V'
      );
    }else if(this.IOS){

      let ret = jsb.reflection.callStaticMethod(
          "ATWrapper",
          "BannerShow:title:",
          "title",
          "message"
        );
      
      console.log("banner load返回：：：",ret)
    }else if(gs.istoutiaogame){
      let self = this;
      this.toutiaoBannerAd.show().catch(function() {
          // gs.events.emit('show-task-text',{text: 'noAds!'} )
      });
    }else if(gs.iswechatgame){
///////////////////////
      this.wechatBannerAd.show().catch(function() {
        // gs.events.emit('show-task-text',{text: 'noAds!'} )
      });
    }
      console.log('banner---------------------end')
  },

  ShowBannerAd(t) {
    
    if (gs.userData.GooglePay) {
      this.HideBannerAd2()
      this.HideBannerAd()
      return;
    }

    if(admobData){
      if(admobData.banner_enabled == 'No'){
        this.HideBannerAd2()
        this.HideBannerAd()
        return;
      } 
    }

    if (this.enabled ) { 

      let type = jsb.reflection.callStaticMethod(
        AppActivity,
        'ShowBannerAd',
        '()V'
      );
    }else if(this.IOS){
       
      let ret = jsb.reflection.callStaticMethod(
          "ATWrapper",
          "BannerShow:title:",
          "title",
          "message"
        );
      
      console.log("banner show返回：：：",ret)

    }
      
  },

  HideBannerAd() {
    if (this.enabled) { 
      let type = jsb.reflection.callStaticMethod(
        AppActivity,
        'HideBannerAd',
        '()V'
      );
    }else if(this.IOS){
      let ret = jsb.reflection.callStaticMethod(
          "ATWrapper",
          "BannerHide:title:",
          "title",
          "message"
        );
      
      console.log("banner hide返回：：：",ret)
    }else if(gs.istoutiaogame){
      this.toutiaoBannerAd.hide();
     

    }else if(gs.iswechatgame){
//////////////////////////
      this.wechatBannerAd.hide();
    }

    
  },

  HideBannerAd2() {
    if (!this.enabled) { return; }

    let type = jsb.reflection.callStaticMethod(
      AppActivity,
      'HideBannerAd2',
      '()V'
    );
  },

  ShowInterstitialAd(t) {
    console.log('interstitialad-------')
    if (gs.userData.newbieGuild) return;
    if (gs.userData.GooglePay || admobData.interstitial_enabled == 'No' || admobData[t] == "No"){
      return;
    }
    if (this.enabled){
      console.log('interstitialad-------2')
      let type = jsb.reflection.callStaticMethod(
        AppActivity,
        'ShowInterstitialAd',
        '()V'
      );
    }else if (this.IOS){
      let ret = jsb.reflection.callStaticMethod(
          "ATWrapper",
          "InterstitialShow:title:",
          "title",
          "message"
        );
      
      console.log("InterstitialShow 返回：：：",ret)
    }else if (gs.isFBInstantGame) {
      gs.showFBInterstitial();
    }else if(gs.istoutiaogame){


    }else if(gs.iswechatgame){
//////////////////////////
 // 在适合的场景显示插屏广告
    AdMob.FaceBookEvent('ShowInterstitialAd');
    this.interstitialAd.show().catch((err) => {
      console.error(err)
    })
    }
    
  },

  LoadInterstitialAd() {
    if (this.enabled) {  
      let type = jsb.reflection.callStaticMethod(
        AppActivity,
        'LoadInterstitialAd',
        '()V'
      );
    }else if(this.IOS){
      let ret = jsb.reflection.callStaticMethod(
          "ATWrapper",
          "InterstitialLoad:title:",
          "title",
          "message"
        );
      
      console.log("InterstitialLoad 返回：：：",ret)
    }else if (gs.isFBInstantGame) {
      gs.getFBInterstitial();
    }
    
  },

  ShowRewardVideoAds() {
    if (this.enabled) { 
      console.log("走了android渠道")
      let type = jsb.reflection.callStaticMethod(
        
        AppActivity,
        'ShowRewardVideoAds',
        '()I'
      );
      console.log("VideoShow 返回：：：",type)

    }else if(this.IOS){
      let ret = jsb.reflection.callStaticMethod(
          "ATWrapper",
          "VideoShow:title:",
          "title",
          "message"
        );
      
      console.log("VideoShow 返回：：：",ret)
    }else if (gs.isFBInstantGame) {
      gs.getFBVideo();
    }else if(gs.istoutiaogame){
      AudioPlayer.timelose(true);
      AudioPlayer.bgmSwitch(true);
      let self = this;
      this.toutiaoRewardVideo.show().catch(function() {
          gs.events.emit('show-task-text',{text: '暂时没有广告，请稍后再试。'} )
          AudioPlayer.bgmSwitch(false);

      });
      function onClose(res){
        self.toutiaoRewardVideo.offClose(onClose);
        console.log("广告播放结束");
        AudioPlayer.bgmSwitch(false);

        if (res.isEnded) {  
           AdMob.onRewarded();
           AdMob.FaceBookEvent('videoFinish');
        }else{
          AdMob.FaceBookEvent('videoCancel');          
          gs.events.emit('show-task-text',{text: '复活失败'} )
        }
      };
      
      this.toutiaoRewardVideo.onClose(onClose);
      //
      
    }else if(gs.iswechatgame){
      /////////////////////////////
      AudioPlayer.timelose(true);
      AudioPlayer.bgmSwitch(true);
      let self = this;
      this.wechatRewardVideo.show().catch(function() {
          gs.events.emit('show-task-text',{text: '暂时没有广告，请稍后再试。'} )
          AudioPlayer.bgmSwitch(false);

      });
      function onClose(res){
        self.wechatRewardVideo.offClose(onClose);
        console.log("广告播放结束");
        AudioPlayer.bgmSwitch(false);

        if (res.isEnded) {  
           AdMob.FaceBookEvent('videoFinish');
           AdMob.onRewarded();
        }else{
          AdMob.FaceBookEvent('videoCancel');
        }
      };
      
      this.wechatRewardVideo.onClose(onClose);
    }
    
  },


  NewTableReceiveAds() {
    if (this.enabled) { 
      let type = jsb.reflection.callStaticMethod(
        AppActivity,
        'ShowRewardVideoAds',
        '()I'
      );
    }else if(this.IOS){
      let ret = jsb.reflection.callStaticMethod(
          "ATWrapper",
          "VideoShow:title:",
          "title",
          "message"
        );
      
      console.log("VideoShow 返回：：：",ret)
    }else if (gs.isFBInstantGame) {
      gs.getFBVideo();
    }else if(gs.istoutiaogame){
      AudioPlayer.timelose(true);
      AudioPlayer.bgmSwitch(true);
      let self = this;
      this.toutiaoRewardVideo.show().catch(function() {
          gs.events.emit('show-task-text',{text: '暂时没有广告，请稍后再试。'} )
          AudioPlayer.bgmSwitch(false);

      });
      function onClose(res){
        self.toutiaoRewardVideo.offClose(onClose);
        console.log("广告播放结束");
        AudioPlayer.bgmSwitch(false);

        if (res.isEnded) {  
           AdMob.onRewarded();
           gs.events.emit('show-task-text',{text: '领取成功！快开一局试试吧！'} )
           AdMob.FaceBookEvent('videoFinish-NewTableRecreive');
        }else{
          gs.events.emit('show-task-text',{text: '领取失败'} )
          AdMob.FaceBookEvent('videoCancel-NewTableRecreive');

        }
      };
      
      this.toutiaoRewardVideo.onClose(onClose);
      //
      
    }else if(gs.iswechatgame){
      /////////////////////////////
      AudioPlayer.timelose(true);
      AudioPlayer.bgmSwitch(true);
      let self = this;
      this.wechatRewardVideo.show().catch(function() {
          gs.events.emit('show-task-text',{text: '暂时没有广告，请稍后再试。'} )
          AudioPlayer.bgmSwitch(false);

      });
      function onClose(res){
        self.wechatRewardVideo.offClose(onClose);
        console.log("广告播放结束");
        AudioPlayer.bgmSwitch(false);

        if (res.isEnded) {  
           AdMob.FaceBookEvent('videoFinish-NewTableRecreive');
           AdMob.onRewarded();
        }else{
          AdMob.FaceBookEvent('videoCancel-NewTableRecreive');
        }
      };
      
      this.wechatRewardVideo.onClose(onClose);
    }
    
  },

  /////////////
  NewClubAds(_i) {
    if (this.enabled) { 
      let type = jsb.reflection.callStaticMethod(
        AppActivity,
        'ShowRewardVideoAds',
        '()I'
      );
    }else if(this.IOS){
      let ret = jsb.reflection.callStaticMethod(
          "ATWrapper",
          "VideoShow:title:",
          "title",
          "message"
        );
      
      console.log("VideoShow 返回：：：",ret)
    }else if (gs.isFBInstantGame) {
      gs.getFBVideo();
    }else if(gs.istoutiaogame){
      AudioPlayer.timelose(true);
      AudioPlayer.bgmSwitch(true);
      let self = this;
      this.toutiaoRewardVideo.show().catch(function() {
          gs.events.emit('show-task-text',{text: '暂时没有广告，请稍后再试。'} )
          AudioPlayer.bgmSwitch(false);

      });
      function onClose(res){
        self.toutiaoRewardVideo.offClose(onClose);
        console.log("广告播放结束");
        AudioPlayer.bgmSwitch(false);

        if (res.isEnded) {  
           gs.clubstime[_i]++
           AdMob.onRewarded();
           cc.sys.localStorage.setItem('clubs', JSON.stringify(gs.clubstime));
           gs.events.emit('show-task-text',{text: '领取成功！'} )
           AdMob.FaceBookEvent('videoFinish-NewClubRecreive');
        }else{
          gs.events.emit('show-task-text',{text: '领取失败'} )
          AdMob.FaceBookEvent('videoCancel-NewClubRecreive');

        }
      };
      
      this.toutiaoRewardVideo.onClose(onClose);
      //
      
    }else if(gs.iswechatgame){
      /////////////////////////////
      AudioPlayer.timelose(true);
      AudioPlayer.bgmSwitch(true);
      let self = this;
      this.wechatRewardVideo.show().catch(function() {
          gs.events.emit('show-task-text',{text: '暂时没有广告，请稍后再试。'} )
          AudioPlayer.bgmSwitch(false);

      });
      function onClose(res){
        self.wechatRewardVideo.offClose(onClose);
        console.log("广告播放结束");
        AudioPlayer.bgmSwitch(false);

        if (res.isEnded) {  
          gs.clubstime[_i]++
          cc.sys.localStorage.setItem('clubs', JSON.stringify(gs.clubstime));
          AdMob.FaceBookEvent('videoFinish-NewClubRecreive');
          AdMob.onRewarded();
        }else{
          AdMob.FaceBookEvent('videoCancel-NewClubRecreive');
        }
      };
      
      this.wechatRewardVideo.onClose(onClose);
    }else{
      gs.clubstime[_i]++
      // AdMob.onRewarded();
      cc.sys.localStorage.setItem('clubs', JSON.stringify(gs.clubstime));
    }
    
  },

  fireBaseEvent(key, val) {
    this.FaceBookEventValue('firebase-'+key, val)
    if (this.enabled) { 
      jsb.reflection.callStaticMethod(
        AppActivity,
        'fireBaseEvent',
        '(Ljava/lang/String;Ljava/lang/String;)V',
        key.toString(),
        val.toString()
      );

    }else if(this.IOS){
      let ret = jsb.reflection.callStaticMethod(
          "ATWrapper",
          "FireBaseUserEvent:title:",
          key.toString(),
          val.toString()
        );
      
      console.log("fireBaseEvent 返回：：：",ret)
    }
    
  },

  fireBaseLogEvent(key, val) {
    this.FaceBookEventValue('firebase-'+key, val)
    if (this.enabled) {  
      jsb.reflection.callStaticMethod(
        AppActivity,
        'fireBaseLogEvent',
        '(Ljava/lang/String;Ljava/lang/String;)V',
        key.toString(),
        val.toString()
      );
    }else if(this.IOS){
      let ret = jsb.reflection.callStaticMethod(
          "ATWrapper",
          "FireBaseEvent:title:",
          key.toString(),
          val.toString()
        );
      
      console.log("fireBaseLogEvent 返回：：：",ret)
    }

    
  },

  GooglePLayPay() {  
    if (this.enabled) {  
      if (gs.userData.GooglePay) { 
        gs.events.emit('show-task-text',{text: 'Ads Removed'} )
        return; 
      }
      AdMob.fireBaseLogEvent('Touch Pay','-1')
      jsb.reflection.callStaticMethod(
        AppActivity,
        'GooglePLayPay',
        '()V'
      );
    }else if(this.IOS && this.iosPayButonLTime()){
      
      if (gs.userData.GooglePay) { 
        gs.events.emit('show-task-text',{text: 'Ads Removed'} )
        return; 
      }
      let ret = jsb.reflection.callStaticMethod(
        "ATWrapper",
        "FirePay:title:",
        "title",
        "message"
      );
    }
      
  },

  IPARecoverPay() {  
    if (this.enabled) {  
      if (gs.userData.GooglePay) { 
        gs.events.emit('show-task-text',{text: 'Ads Removed'} )
        return; 
      }
      AdMob.fireBaseLogEvent('Touch Pay','-1')
      jsb.reflection.callStaticMethod(
        AppActivity,
        'GooglePLayPay',
        '()V'
      );
    }else if(this.IOS && this.iosPayButonLTime()){
      
      if (gs.userData.GooglePay) { 
        gs.events.emit('show-task-text',{text: 'Ads Removed'} )
        return; 
      }
      let ret = jsb.reflection.callStaticMethod(
        "ATWrapper",
        "RecoverPay:title:",
        "title",
        "message"
      );
    }
      
  },
  XiaoMiPay(){
    if (this.enabled) {  
      if (gs.userData.GooglePay) { 
        gs.events.emit('show-task-text',{text: 'Ads Removed'} )
        return; 
      }
      AdMob.fireBaseLogEvent('Touch Pay MI','-1')
      jsb.reflection.callStaticMethod(
        AppActivity,
        'XiaoMiPay',
        '(Ljava/lang/String;)V',
        '{"code":"removedads1120","id":"RemoveAD","price":"2.99","type":"USD"}',
      );
    }

  },
  showAdInterval() {
    return true;
    // let data = Date.parse(new Date())
    // // console.log('间隔时间：：：',data)
    // // console.log('间隔时间2：：：',this.intervalTime)
    // // console.log(this.intervalTime - data)
    // if(!this.intervalTime||data - this.intervalTime > 30000){
    //   this.intervalTime = data
    //   return true;
    // }
    // return false;
  },
  iosPayButonLTime() {
    let data = Date.parse(new Date())
    // console.log('间隔时间：：：',data)
    // console.log('间隔时间2：：：',this.intervalTime)
    // console.log(this.intervalTime - data)
    if(!this.TouchTime||data - this.TouchTime > 5000){
      this.TouchTime = data
      return true;
    }
    return false;
  },

  FaceBookEvent(code){
    if (this.enabled) {  
      jsb.reflection.callStaticMethod(
        AppActivity,
        'FaceBookEvent',
        '(Ljava/lang/String;)V',
        code.toString(),
      );
    }else if(this.IOS){
      let ret = jsb.reflection.callStaticMethod(
          "ATWrapper",
          "FaceBookEvent:title:",
          code.toString(),
          code.toString()
        );
      
      console.log("FaceBookEvent 返回：：：",ret)
    }else if (gs.isFBInstantGame){
      FBInstant.logEvent(code);
    }else if(gs.iswechatgame){
      wx.aldSendEvent(code);
      sk.dotEvent(code);
    }else if(gs.istoutiaogame){
      wx.aldSendEvent(code);
    }
  },

  FaceBookEventValue(key,val){
    if (this.enabled) {  
      jsb.reflection.callStaticMethod(
        AppActivity,
        'FaceBookEventValue',
        '(Ljava/lang/String;Ljava/lang/String;)V',
        key.toString(),
        val.toString()
      );
    }else if (this.IOS){
      let ret = jsb.reflection.callStaticMethod(
          "ATWrapper",
          "FaceBookEventValue:title:",
          key.toString(),
          val.toString()
        );
      
      console.log("FaceBookEventValue 返回：：：",ret)
    }else if (gs.isFBInstantGame){
      console.log('fblog ::::'+key)
      FBInstant.logEvent(key, val || '');
    }else if(gs.iswechatgame){
      wx.aldSendEvent(key,{val});
      sk.dotEvent(key,val);
    }else if(gs.istoutiaogame){
      wx.aldSendEvent(key,{val});
    }
  },

  onRecordingscreenstart(){
    test.videoPath=null;

    const recorder = tt.getGameRecorderManager();
        recorder.onStart(res =>{
      
            console.log("开始录屏");
          })
          
          recorder.start({
            duration: 120,
          })
          //
   
    
          //  
  },
  onRecordingscreenStop(){
    const recorder = tt.getGameRecorderManager();
    
    recorder.onStop(res =>{
      console.log(res.videoPath);
      console.log("录屏结束");
      
    test.videoPath=res.videoPath;
      
      console.log("videoPath: "+test.videoPath);


    })
    recorder.stop();  
    
  },
};

module.exports = AdMob;
