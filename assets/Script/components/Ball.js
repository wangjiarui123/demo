'use strict';
const gs = require('GameState');
const AdMob = require('AdMob');
const ColoredBallMaterial = require('../material/ColoredBallMaterial');
const TexturedBallMaterial = require('../material/TexturedBallMaterial');
const {
  BALL, CUSHION, POCKET_WRAP, SLATE_WRAP, POCKET_TRIGGER,
  POCKET_GRAVITY_FIELD, BALL_REMOVER, HEART_SENSOR, REMOVE_BALL_SENSOR
} = require('../constants/ColliderTags');
const { vec2, vec3, vec4, mat4 } = cc.vmath;
const origin = vec3.new(0, 0, 0);
const DEG = Math.PI / 180;


const colors = [
  vec4.new(1.0, 1.0, 1.0, 1.0),
  vec4.new(1.0, 0.7647, 0.0, 1.0),
  vec4.new(0.1333, 0.0, 0.9019, 1.0),
  vec4.new(0.7686, 0.0, 0.0, 1.0),
  vec4.new(0.4862, 0.0, 0.5843, 1.0),
  vec4.new(0.9725, 0.5254, 0.0, 1.0),
  vec4.new(0.0, 0.5333, 0.0, 1.0),
  vec4.new(0.5176, 0.2, 0.0862, 1.0),
  vec4.new(0.0509, 0.0509, 0.0509, 1.0),
];

const debugging = false;

let _c = 0;

cc.Class({
  extends: cc.Component,

  properties: {
    highlightSpriteFrame: cc.SpriteFrame,
    guideSensor: cc.Node,
    ballSprite: cc.Node,
    showClick: cc.Node,
    ////////////////////
    hl:cc.SpriteAtlas,
    highlightSprite:cc.Sprite,
    trailingTexture:cc.SpriteFrame,
    trailing:cc.MotionStreak,
    ////////////////////    

    textures: { default: [], type: [cc.SpriteFrame] },

    touchTexture: { default: [], type: [cc.SpriteFrame] },
    number: {
      get() { return this._number; },
      set(val) {
        this._number = this.node._number = val % this.textures.length;
      },
    },

    radius: { default: 16, type: cc.Float },
    textured: { default: true },
    texture: { default: null, type: cc.Texture2D, visible: false },

    z: { default: 0, type: cc.Float, visible: false },
    fallingDuration: { default: 0, type: cc.Float, visible: false },

    _number: { default: 0, type: cc.Integer,visible: false },
  },

  ctor() {
    this.ratio = 0.5;

    const r = this.rotation = {
      axis: vec3.new(Math.random(), Math.random(), 0),
      rad: Math.random(),
      speed: Math.random() * 4 + 1,
      matrix: mat4.create(),
      m: mat4.create()
    };

    mat4.fromRotation(r.matrix, r.rad, r.axis);
  },

  updateSize() {
    const r = this.radius;
    this.node.width = this.node.height = 2 * r;
    this.ballSprite.width = this.ballSprite.height = 2 * ((r+2) / this.ratio);
    this.node.getComponent(cc.PhysicsCircleCollider).radius = r;
    this.guideSensor.getComponent(cc.PhysicsCircleCollider).radius = 2 * r;
  },

  setNumber(n) { this.number = n; },

  // use this for initialization
  onLoad: function () {
    this.getComponent(cc.Graphics).enabled = debugging;

    this.radius = 16;
    this.node.isBall = true;
    this.node._number = this._number;
    this._loaded = true;
    this._rb = this.node.getComponent(cc.RigidBody);

    this.updateSize();

    if (this.textured) {
      this.texture = this.textures[this._number].getTexture();
      this._material = new TexturedBallMaterial(
        this.texture,
        this.rotation.matrix,
        this.ratio
      );
    } else {
      this._color = colors[this._number % 8];
      this._material = new ColoredBallMaterial(
        this._color,
        this._number === 0 ? 1 : 0,
        this.rotation.matrix,
        this.ratio,
      );
    }
    
    this.node.on('touchend',()=>{
       if (gs.newbieSwitch==10) return;
       AudioPlayer.audio('ball_touched')
       
       if (gs.userData.newbieGuild){
        gs.events.emit('touch-ball', { id: this.node.ncolor });
        if (this.node.ncolor === 3){
          this.node.emit('touch-sensorBall', { pos: this.node.position ,dir: true});
        }else{
          this.node.emit('touch-sensorBall', { pos: this.node.position });
        }
       }else{
        this.node.emit('touch-sensorBall', { pos: this.node.position });
       }
       if (this.node._number > 0 ){
        this.showClick.active = true;
        this.showClick.getComponent(cc.Sprite).spriteFrame = this.touchTexture[this.node._number];
        this.showClick.getComponent(cc.Animation).play('ball-click');
        this.touchBall = true;
       }
       console.log("球编号"+this.node._number)
       if (gs.currentLevel<11){
        // AdMob.FaceBookEvent('ball_touched-' + gs.currentLevel)
        //前11关触碰球
       }
    })


    if(this.node._number===0){
      this.setMotionStreak(0.5, 20, 30, this.trailingTexture);
      console.log("白球")
    }else{
      this.setMotionStreak(0, 0, 0, this.trailingTexture);
      console.log("其他球")
    }
  },

  start() {
    const sp = this.ballSprite.getComponent(cc.Sprite);
    sp._material = this._material;
    sp._renderData._material = this._material;

    this._material.setTexture(sp.spriteFrame.getTexture());
    this._material.setHighlight(this.highlightSpriteFrame.getTexture());

    if (this.textured) {
      this._material.setBallTexture(this.texture);
    } else {
      this._material.setColor(this._color);
      this._material.setMarker(this._number === 0 ? 1 : 0);
    }
  },

  // called every frame
  update: function (dt) {
    const r = this.rotation;

    const vel = this.node.getComponent(cc.RigidBody).linearVelocity;
    const v = vec3.new(vel.x, -vel.y, 0);
    const l = vec3.length(v);

    if (l > 0) {
      vec3.normalize(r.axis, v);
      vec3.rotateZ(r.axis, r.axis, origin, Math.PI * 0.5);
      mat4.fromRotation(r.m, l * dt / 2 / this.radius, r.axis);
      mat4.multiply(r.matrix, r.m, r.matrix);
      this._material.setRotationMatrix(r.matrix);
    }
    /////////////
    var xy=this.node.position;
    var vx=Math.floor(xy.x/57.14);
    var vy=Math.floor((xy.y+20)/50);
    // var vx=Math.floor(xy.x/30);
    // var vy=Math.floor((xy.y)/53.3);
    // console.log("x:"+vx+" y:"+vy)

    this.change(vx,vy);   
  },

  // will be called once when two colliders begin to contact
  onBeginContact(contact, selfCollider, otherCollider) {
    // cc.PhysicsManager.FIXED_TIME_STEP = 0.01
    switch (otherCollider.tag) {
      case BALL:
        // console.log('self.selfCollider.node.type:',selfCollider.node.type)
        // console.log('self.otherCollider.node.type:',otherCollider.node.type)
        try{
          if(gs.shootBallConfig.angle<=110 && self.selfCollider.node.type === 'cueBall'){
            var worldManifold = contact.getWorldManifold();
            var points = worldManifold.points;
            var normal = worldManifold.normal;
            var vel1 = selfCollider.getComponent(cc.RigidBody).getLinearVelocityFromWorldPoint( worldManifold.normal );
            var vel2 = otherCollider.getComponent(cc.RigidBody).getLinearVelocityFromWorldPoint( worldManifold.normal );
            var relativeVelocity = vel1.sub(vel2);
            
            relativeVelocity = relativeVelocity.rotate(Math.PI / 180 * gs.shootBallConfig.angle)//.negSelf()
            
            relativeVelocity = relativeVelocity.normalize().mulSelf(3000*gs.shootBallConfig.power/10)
            // console.log(relativeVelocity)
            otherCollider.getComponent(cc.RigidBody).applyForceToCenter(relativeVelocity,true);
          }
          
          

          AudioPlayer.audio(this.node.getComponent(cc.RigidBody).linearVelocity,'ball')
          this.collideWithBall(contact, selfCollider, otherCollider);
          if(gs.currentLevel<11){
              // AdMob.FaceBookEvent('ball-onBeginContact-BALL-' + gs.currentLevel)
              //前十一关首次接触球
          }
        }catch(err){
          // console.log(err)
        }
        
        break;
      case CUSHION:
        AudioPlayer.audio(this.node.getComponent(cc.RigidBody).linearVelocity,'cushion')
        this.collideWithCushion(contact, selfCollider, otherCollider);
        if(gs.currentLevel<11){
            // AdMob.FaceBookEvent('ball-onBeginContact-CUSHION-' + gs.currentLevel)
              //前十一关首次接触球的后续

        }
        break;
      case POCKET_WRAP:
        break;
      case SLATE_WRAP:
        if (!this.node.inPocket || this.node.alreadyInPocket) {
          contact.disabled = true;
        }
        break;
      case POCKET_TRIGGER:
        if (!this.node.inPocket) {
          this.node.inPocket = true;
          this.node.pocketName = otherCollider.node.parent.name;
        }
        break;
      case POCKET_GRAVITY_FIELD:
        AudioPlayer.audio(this.node.getComponent(cc.RigidBody).linearVelocity,'ball_remove')
        break;
      case BALL_REMOVER:
        this.collideWithBallRemover(contact, selfCollider, otherCollider);
        break;
      case HEART_SENSOR:
        this.collideWithHeartSensor(contact, selfCollider, otherCollider);
        break;
      case REMOVE_BALL_SENSOR:
        this.collideWithRemoveBall(contact, selfCollider, otherCollider);
        break;
    }
  },

  // will be called once when the contact between two colliders just about to end.
  onEndContact(contact, selfCollider, otherCollider) {
    switch (otherCollider.tag) {
      case POCKET_GRAVITY_FIELD:
        this.endCollideWithPocketGravityField(contact, selfCollider, otherCollider);
        break;

      case BALL:
        if(this.touchBall ){
          var worldManifold = contact.getWorldManifold();
          var points = worldManifold.points;
          var normal = worldManifold.normal;
          var vel1 = selfCollider.getComponent(cc.RigidBody).getLinearVelocityFromWorldPoint( worldManifold.normal );
          var vel2 = otherCollider.getComponent(cc.RigidBody).getLinearVelocityFromWorldPoint( worldManifold.normal );
          var relativeVelocity = vel1.sub(vel2);
          relativeVelocity = relativeVelocity.normalize().mulSelf(3000*gs.shootBallConfig.power * (gs.shootBallConfig.distance / 600))
          otherCollider.getComponent(cc.RigidBody).applyForceToCenter(relativeVelocity,true);
          this.touchBall = false;
        }
        break;
    }
    
  },

  // will be called everytime collider contact should be resolved
  onPreSolve(contact, selfCollider, otherCollider) {
  },

  // will be called every time collider contact is resolved
  onPostSolve(contact, selfCollider, otherCollider) {
    // if(gs.shootBallConfig.angle<=110){
    //   gs.shootBallConfig.angle = 1000 
    //   gs.shootBallConfig.step = 0.01
    //   cc.PhysicsManager.FIXED_TIME_STEP = 0.01
    // }
    if(cc.PhysicsManager.FIXED_TIME_STEP < 0.01){
      cc.PhysicsManager.FIXED_TIME_STEP = 0.01
      gs.shootBallConfig.step = 0.01
      gs.shootBallConfig.angle = 1000 
      if(gs.currentLevel<11){
        // AdMob.FaceBookEvent('ball-PhysicTimeStep-' + gs.currentLevel)
              //前十一关球物理
      }
    }
  },

  collideWithCushion(contact, selfCollider, otherCollider) {
    contact.setRestitution(0.55);
  },

  collideWithBall(contact, selfCollider, otherCollider) {
    if (contact.disabledOnce || contact.shouldBeIgnored) {
      return;
    }

    if (
      selfCollider.node.alreadyInPocket ||
      otherCollider.node.alreadyInPocket
    ) {
      contact.disabled = true;
      contact.shouldBeIgnored = true;
      return;
    }

    let ab = selfCollider.body;
    let bb = otherCollider.body;
    let va = ab.linearVelocity;
    let vb = bb.linearVelocity;

    if (va.mag() > 0 && vb.mag() > 0) { return; }

    let angle;

    if (va.mag() === 0) {
      angle = vb.angle(bb.getWorldCenter().sub(ab.getWorldCenter()));
    } else {
      angle = va.angle(ab.getWorldCenter().sub(bb.getWorldCenter()));
    }

    if (angle / Math.PI * 180 < 100) {
      contact.disabled = true;
    } else {
      contact.setRestitution(1);
    }
  },

  collideWithPocketGravityField(contact, selfCollider, otherCollider) {
    if (!this.node.alreadyInPocket) {
      this.pocketGravityCenter = otherCollider.offset;
    }
  },

  endCollideWithPocketGravityField(contact, selfCollider, otherCollider) {
    this.pocketGravityCenter = undefined;
  },

  collideWithBallRemover(contact, selfCollider, otherCollider) {
    if (this.node.alreadyInPocket) {
      this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
      this.node.active = false;
      this.z = 0;
      this.fallingDuration = 0;
      let ev = new cc.Event.EventCustom('ball-in-pocket', true);
      
      ev.detail = { ball: this.node };
      this.node.dispatchEvent(ev);
    }
  },

  collideWithHeartSensor(contact, selfCollider, otherCollider) {
    if (this._number > 0) {
      otherCollider.node.getComponent('AddCue').collect();
    }
  },

  collideWithRemoveBall(contact, selfCollider, otherCollider) {
    if (this._number > 0) {
      otherCollider.node.getComponent('RemoveBall').collect();
    }
  },
  /////////////
  change(x1,y1){
    let hl0=0;

    let x=Math.abs(x1);
    let y=Math.abs(y1);

        if(x==0){
            if(y==0){
                hl0=this.hl.getSpriteFrame("0_0")
            }else if(y==1){
                hl0=this.hl.getSpriteFrame("1_0")
            }else if(y==2){
                hl0=this.hl.getSpriteFrame("2_0")
            }else if(y==3){
                hl0=this.hl.getSpriteFrame("3_0")
            }else if(y==4){
                hl0=this.hl.getSpriteFrame("4_0")
            }else if(y==5){
                hl0=this.hl.getSpriteFrame("5_0")
            }else if(y==6){
                hl0=this.hl.getSpriteFrame("6_0")
            }
        }else if(x==1){
            if(y==0){
                hl0=this.hl.getSpriteFrame("0_1")
                // hl0.rotation=0
            }else if(y==1){
                hl0=this.hl.getSpriteFrame("1_1")
            }else if(y==2){
                hl0=this.hl.getSpriteFrame("2_1")
            }else if(y==3){
                hl0=this.hl.getSpriteFrame("3_1")
            }else if(y==4){
                hl0=this.hl.getSpriteFrame("4_1")
            }else if(y==5){
                hl0=this.hl.getSpriteFrame("5_1")
            }else if(y==6){
                hl0=this.hl.getSpriteFrame("6_1")
            }
        }else if(x==2){
            if(y==0){
                hl0=this.hl.getSpriteFrame("0_2")
            }else if(y==1){
                hl0=this.hl.getSpriteFrame("1_2")
            }else if(y==2){
                hl0=this.hl.getSpriteFrame("2_2")
            }else if(y==3){
                hl0=this.hl.getSpriteFrame("3_2")
            }else if(y==4){
                hl0=this.hl.getSpriteFrame("4_2")
            }else if(y==5){
                hl0=this.hl.getSpriteFrame("5_2")
            }else if(y==6){
                hl0=this.hl.getSpriteFrame("6_2")
            }
        }else if(x==3){
            if(y==0){
                hl0=this.hl.getSpriteFrame("0_3")
            }else if(y==1){
                hl0=this.hl.getSpriteFrame("1_3")
            }else if(y==2){
                hl0=this.hl.getSpriteFrame("2_3")
            }else if(y==3){
                hl0=this.hl.getSpriteFrame("3_3")
            }else if(y==4){
                hl0=this.hl.getSpriteFrame("4_3")
            }else if(y==5){
                hl0=this.hl.getSpriteFrame("5_3")
            }else if(y==6){
                hl0=this.hl.getSpriteFrame("6_3")
            }
        }else if(x==4){
            if(y==0){
                hl0=this.hl.getSpriteFrame("0_4")
            }else if(y==1){
                hl0=this.hl.getSpriteFrame("1_4")
            }else if(y==2){
                hl0=this.hl.getSpriteFrame("2_4")
            }else if(y==3){
                hl0=this.hl.getSpriteFrame("3_4")
            }else if(y==4){
                hl0=this.hl.getSpriteFrame("4_4")
            }else if(y==5){
                hl0=this.hl.getSpriteFrame("5_4")
            }else if(y==6){
                hl0=this.hl.getSpriteFrame("6_4")
            }
        }else if(x==5){
            if(y==0){
                hl0=this.hl.getSpriteFrame("0_5")
            }else if(y==1){
                hl0=this.hl.getSpriteFrame("1_5")
            }else if(y==2){
                hl0=this.hl.getSpriteFrame("2_5")
            }else if(y==3){
                hl0=this.hl.getSpriteFrame("3_5")
            }else if(y==4){
                hl0=this.hl.getSpriteFrame("4_5")
            }else if(y==5){
                hl0=this.hl.getSpriteFrame("5_5")
            }else if(y==6){
                hl0=this.hl.getSpriteFrame("6_5")
            }
        }else if(x==6){
            if(y==0){
                hl0=this.hl.getSpriteFrame("0_6")
            }else if(y==1){
                hl0=this.hl.getSpriteFrame("1_6")
            }else if(y==2){
                hl0=this.hl.getSpriteFrame("2_6")
            }else if(y==3){
                hl0=this.hl.getSpriteFrame("3_6")
            }else if(y==4){
                hl0=this.hl.getSpriteFrame("4_6")
            }else if(y==5){
                hl0=this.hl.getSpriteFrame("5_6")
            }else if(y==6){
                hl0=this.hl.getSpriteFrame("6_6")
            }
        }else if(x==7){
            if(y==0){
                hl0=this.hl.getSpriteFrame("0_7")
            }else if(y==1){
                hl0=this.hl.getSpriteFrame("1_7")
            }else if(y==2){
                hl0=this.hl.getSpriteFrame("2_7")
            }else if(y==3){
                hl0=this.hl.getSpriteFrame("3_7")
            }else if(y==4){
                hl0=this.hl.getSpriteFrame("4_7")
            }else if(y==5){
                hl0=this.hl.getSpriteFrame("5_7")
            }else if(y==6){
                hl0=this.hl.getSpriteFrame("6_7")
            }
        }else if(x==8){
            if(y==0){
                hl0=this.hl.getSpriteFrame("0_8")
            }else if(y==1){
                hl0=this.hl.getSpriteFrame("1_8")
            }else if(y==2){
                hl0=this.hl.getSpriteFrame("2_8")
            }else if(y==3){
                hl0=this.hl.getSpriteFrame("3_8")
            }else if(y==4){
                hl0=this.hl.getSpriteFrame("4_8")
            }else if(y==5){
                hl0=this.hl.getSpriteFrame("5_8")
            }else if(y==6){
                hl0=this.hl.getSpriteFrame("6_8")
            }
        }else if(x==9){
            if(y==0){
                hl0=this.hl.getSpriteFrame("0_9")
            }else if(y==1){
                hl0=this.hl.getSpriteFrame("1_9")
            }else if(y==2){
                hl0=this.hl.getSpriteFrame("2_9")
            }else if(y==3){
                hl0=this.hl.getSpriteFrame("3_9")
            }else if(y==4){
                hl0=this.hl.getSpriteFrame("4_9")
            }else if(y==5){
                hl0=this.hl.getSpriteFrame("5_9")
            }else if(y==6){
                hl0=this.hl.getSpriteFrame("6_9")
            }
        }else if(x==10){
            if(y==0){
                hl0=this.hl.getSpriteFrame("0_10")
            }else if(y==1){
                hl0=this.hl.getSpriteFrame("1_10")
            }else if(y==2){
                hl0=this.hl.getSpriteFrame("2_10")
            }else if(y==3){
                hl0=this.hl.getSpriteFrame("3_10")
            }else if(y==4){
                hl0=this.hl.getSpriteFrame("4_10")
            }else if(y==5){
                hl0=this.hl.getSpriteFrame("5_10")
            }else if(y==6){
                hl0=this.hl.getSpriteFrame("6_10")
            }
        }else if(x==11){
            if(y==0){
                hl0=this.hl.getSpriteFrame("0_11")
            }else if(y==1){
                hl0=this.hl.getSpriteFrame("1_11")
            }else if(y==2){
                hl0=this.hl.getSpriteFrame("2_11")
            }else if(y==3){
                hl0=this.hl.getSpriteFrame("3_11")
            }else if(y==4){
                hl0=this.hl.getSpriteFrame("4_11")
            }else if(y==5){
                hl0=this.hl.getSpriteFrame("5_11")
            }else if(y==6){
                hl0=this.hl.getSpriteFrame("6_11")
            }
        }else if(x==12){
            if(y==0){
                hl0=this.hl.getSpriteFrame("0_12")
            }else if(y==1){
                hl0=this.hl.getSpriteFrame("1_12")
            }else if(y==2){
                hl0=this.hl.getSpriteFrame("2_12")
            }else if(y==3){
                hl0=this.hl.getSpriteFrame("3_12")
            }else if(y==4){
                hl0=this.hl.getSpriteFrame("4_12")
            }else if(y==5){
                hl0=this.hl.getSpriteFrame("5_12")
            }else if(y==6){
                hl0=this.hl.getSpriteFrame("6_12")
            }
        }

        //////////////
        



    if(x1<=0){
        this.highlightSprite.node.scaleX=1;
    }else if(x1>0){
        this.highlightSprite.node.scaleX=-1;
    }

    if(y1<=0){
        this.highlightSprite.node.scaleY=1;
    }else if(y1>0){
        this.highlightSprite.node.scaleY=-1;
    }

    
        


    this.highlightSprite.getComponent(cc.Sprite).spriteFrame=hl0

  },

  setMotionStreak(fadeTime, minSeg, stroke, texture) {
    this.trailing.fadeTime = fadeTime;
    this.trailing.minSeg = minSeg;
    this.trailing.stroke = stroke;
    // this.trailing.texture = texture;
    console.log("依次为"+fadeTime+minSeg+stroke)
  },
});
