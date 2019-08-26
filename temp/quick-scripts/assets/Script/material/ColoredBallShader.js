(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/material/ColoredBallShader.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6b60fZ2lQ9EDq5s4Z5llnoU', 'ColoredBallShader', __filename);
// Script/material/ColoredBallShader.js

'use strict';

var vert = '\nuniform mat4 viewProj;\nuniform mat4 model;\nattribute vec3 a_position;\nattribute vec2 a_uv0;\nvarying vec2 uv0;\nvoid main () {\n  mat4 mvp;\n  mvp = viewProj * model;\n\n  vec4 pos = mvp * vec4(a_position, 1);\n  gl_Position = pos;\n  uv0 = a_uv0;\n}\n';

var frag = '\nuniform sampler2D highlight;\nuniform mat4 rotationMatrix;\nuniform vec4 color;\nuniform int marker;\nuniform float ratio;\n\nvarying vec2 uv0;\n\nfloat PI = 3.1415926535897932384626433832795;\nvec3 lightDirection = vec3(0.0, 0.0, 1.0);\n\nvec4 ballColor() {\n  vec4 p = vec4(uv0 * 2.0 - 1.0, 0.0, 0.0) / ratio;\n\n  float r = sqrt(dot(p.xy, p.xy));\n  vec3 c;\n  float a;\n\n    p.z = sqrt(1.0 - r * r);\n\n    float light = dot(p.xyz, lightDirection) * 0.7 + 0.3;\n\n    /*\n    * Rotate p\n    */\n\n    p *= rotationMatrix;\n\n    /**\n    * Calculate r after rotation\n    */\n    float r1 = sqrt(dot(p.xy, p.xy));\n    float r2 = sqrt(dot(p.xz, p.xz));\n\n    /**\n    * Calculate phy\n    */\n    float phy = asin(abs(p.x / r2));\n\n    if (p.z < 0.0) { phy = PI - phy; }\n    if (p.x < 0.0) { phy = -phy; }\n\n    /**\n    * Calculate theta\n    */\n    float theta = asin(p.y);\n\n    /**\n    * Calculate uv\n    */\n    vec2 uv = vec2(phy / PI, theta / (0.5 * PI));\n\n    a = 1.0 - smoothstep(0.43, 0.46, abs(uv.y));\n    c = color.rgb * a + vec3(1.0 - a);\n\n    if (marker == 1) {\n      a = 1.0 - smoothstep(0.18, 0.21, r1);\n      c = vec3(1.0, 0.0, 0.0) * a + c * (1.0 - a);\n    }\n\n    c *= light;\n\n    // a = 1.0;\n    // if (r > 0.87) {\n    //   a = -10.0 * r + 9.7 ;\n    // }\n\n    // gl_FragColor = vec4(c, a);\n\n  a = 1.0 - smoothstep(0.87, 1.0 / ratio, r);\n  a *= 1.0 - smoothstep(0.93, 0.96, r);\n\n  return vec4(c, a);\n  // return vec4(r);\n}\n\nvec4 highlightColor() {\n  vec2 uv = (uv0 - 0.5) / ratio + 0.5;\n  vec4 c = texture2D(highlight, uv);\n  return c;\n}\n\nvec4 shadowColor() {\n  float a = 1.0 - smoothstep(0.2, 0.45, length(uv0 - 0.5));\n  vec4 c = vec4(vec3(0.0), a * 0.3);\n  return c;\n}\n\nvoid main(void) {\n  vec4 b = ballColor();\n  vec4 s = shadowColor();\n  vec4 h = highlightColor();\n  vec4 c = clamp(mix(s, b, b.a), 0.0, 1.0) + h * h.a * 0.5;\n  gl_FragColor = c;\n}\n';

var shader = { name: 'ColoredBall', defines: [], vert: vert, frag: frag };

cc.game.once(cc.game.EVENT_ENGINE_INITED, function () {
  cc.renderer._forward._programLib.define(shader.name, // name
  shader.vert, // vertex shader source code
  shader.frag, // fragment shader source code
  shader.defines // defines - affects shader #define so that shader code canbe modified by #ifdef programatically
  );
});

module.exports = shader;

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
        //# sourceMappingURL=ColoredBallShader.js.map
        