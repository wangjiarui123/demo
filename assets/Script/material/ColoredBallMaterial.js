const math = cc.vmath;
const renderEngine = cc.renderer.renderEngine;
const renderer = renderEngine.renderer;
const gfx = renderEngine.gfx;
const Material = renderEngine.Material;

const DEG = Math.PI / 180;

// Require to load the shader to program lib
require('./ColoredBallShader');

function ColoredBallMaterial(color, maker, rotationMatrix, ratio) {
  Material.call(this, false);

  this._texture = null;
  this._highlight = null;
  this._color = math.vec4.new(.1, .9, .1, 1);
  this._marker = 0;
  this._rotationMatrix = rotationMatrix;
  this._ratio = ratio;

  var pass = new renderer.Pass('ColoredBall');
  pass.setDepth(false, false);
  pass.setCullMode(gfx.CULL_NONE);
  pass.setBlend(
    gfx.BLEND_FUNC_ADD,
    gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA,
    gfx.BLEND_FUNC_ADD,
    gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA
  );

  let mainTech = new renderer.Technique(
    ['transparent'],
    [
      { name: 'iTexture', type: renderer.PARAM_TEXTURE_2D },
      { name: 'highlight', type: renderer.PARAM_TEXTURE_2D },
      { name: 'rotationMatrix', type: renderer.PARAM_MAT4 },
      { name: 'color', type: renderer.PARAM_FLOAT4 },
      { name: 'marker', type: renderer.PARAM_INT },
      { name: 'ratio', type: renderer.PARAM_FLOAT },
    ],
    [ pass ]
  );

  // need _effect to calculate hash
  this._effect = this.effect = new renderer.Effect(
    [ mainTech ],
    {
      iTexture: this._texture,
      highlight: this._highlight,
      rotationMatrix: this._rotationMatrix,
      color: this._color,
      marker: this._marker,
      ratio: this._ratio,
    },
    []
  );

  this._mainTech = mainTech;
}
cc.js.extend(ColoredBallMaterial, Material);
cc.js.mixin(ColoredBallMaterial.prototype, {
  getTexture () {
    return this._texture;
  },

  setTexture (val) {
    if (this._texture !== val) {
      this._texture = val;
      this._texture.update();
      this.effect.setProperty('iTexture', val.getImpl());
    }
  },

  setHighlight(val) {
    if (this._highlight !== val) {
      this._highlight = val;
      this._highlight.update();
      this.effect.setProperty('highlight', val.getImpl());
    }
  },

  setRotationMatrix(val) {
    this._rotationMatrix = val;
    this.effect.setProperty('rotationMatrix', val);
  },

  setColor(val) {
    this._color = val;
    this.effect.setProperty('color', val);
  },

  setMarker(val) {
    this._marker = !!val ? 1 : 0;
    this.effect.setProperty('marker', val);
  },

  setRatio(val) {
    this._ratio = val;
    this.effect.setProperty('ratio', val);
  },
});

module.exports = ColoredBallMaterial;
