"use strict";
cc._RF.push(module, '788a9oESAtOmorHsyKnNgiN', 'TexturedBallMaterial');
// Script/material/TexturedBallMaterial.js

'use strict';

var math = cc.vmath;
var renderEngine = cc.renderer.renderEngine;
var renderer = renderEngine.renderer;
var gfx = renderEngine.gfx;
var Material = renderEngine.Material;

var DEG = Math.PI / 180;

// Require to load the shader to program lib
require('./TexturedBallShader');

function TexturedBallMaterial(texture, rotationMatrix, ratio) {
  Material.call(this, false);

  this._ballTexture = null;
  this._texture = null;
  this._highlight = null;
  this._ratio = ratio;
  this._rotationMatrix = rotationMatrix;

  var pass = new renderer.Pass('TexturedBall');
  pass.setDepth(false, false);
  pass.setCullMode(gfx.CULL_NONE);
  pass.setBlend(gfx.BLEND_FUNC_ADD, gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA, gfx.BLEND_FUNC_ADD, gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA);

  var mainTech = new renderer.Technique(['transparent'], [{ name: 'iTexture', type: renderer.PARAM_TEXTURE_2D }, { name: 'ballTexture', type: renderer.PARAM_TEXTURE_2D }, { name: 'highlight', type: renderer.PARAM_TEXTURE_2D }, { name: 'rotationMatrix', type: renderer.PARAM_MAT4 }, { name: 'ratio', type: renderer.PARAM_FLOAT }], [pass]);

  // need _effect to calculate hash
  this._effect = this.effect = new renderer.Effect([mainTech], {
    iTexture: this._texture,
    ballTexture: this._ballTexture,
    highlight: this._highlight,
    rotationMatrix: this._rotationMatrix,
    ratio: this._ratio
  }, []);

  this._mainTech = mainTech;
}
cc.js.extend(TexturedBallMaterial, Material);
cc.js.mixin(TexturedBallMaterial.prototype, {
  getTexture: function getTexture() {
    return this._texture;
  },
  setTexture: function setTexture(val) {
    if (this._texture !== val) {
      this._texture = val;
      this._texture.update({ mipmap: true });
      this.effect.setProperty('iTexture', val.getImpl());
    }
  },
  setBallTexture: function setBallTexture(val) {
    if (this._ballTexture !== val) {
      this._ballTexture = val;
      this._ballTexture.update({ mipmap: true });
      this.effect.setProperty('ballTexture', val.getImpl());
    }
  },
  setHighlight: function setHighlight(val) {
    if (this._highlight !== val) {
      this._highlight = val;
      this._highlight.update();
      this.effect.setProperty('highlight', val.getImpl());
    }
  },
  setRotationMatrix: function setRotationMatrix(val) {
    this._rotationMatrix = val;
    this.effect.setProperty('rotationMatrix', val);
  },
  setRatio: function setRatio(val) {
    this._ratio = val;
    this.effect.setProperty('ratio', val);
  }
});

module.exports = TexturedBallMaterial;

cc._RF.pop();