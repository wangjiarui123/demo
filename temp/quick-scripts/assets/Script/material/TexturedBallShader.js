(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/material/TexturedBallShader.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b34dcGBa+dI459y1PJ6e7G1', 'TexturedBallShader', __filename);
// Script/material/TexturedBallShader.js

'use strict';

var vert = '\nuniform mat4 viewProj;\nuniform mat4 model;\nattribute vec3 a_position;\nattribute vec2 a_uv0;\nvarying vec2 uv0;\nvarying vec4 pos;\n\nvoid main () {\n  mat4 mvp = viewProj * model;\n\n  pos = mvp * vec4(a_position, 1);\n  gl_Position = pos;\n  uv0 = a_uv0;\n}\n';

var frag = '\nuniform sampler2D iTexture;\nuniform sampler2D ballTexture;\nuniform sampler2D highlight;\nuniform mat4 rotationMatrix;\nuniform float ratio;\n\nvarying vec2 uv0;\nvarying vec4 pos;\n\nfloat PI = 3.1415926535897932384626433832795;\nvec3 lightDirection = vec3(0.0, 0.0, 1500.0);\nvec3 specular = vec3(0.7,0.7,0.65);\nvec3 vAmbient = vec3(1.25,1.25,1.25);\n\nvec4 ballColor() {\n  vec4 p = vec4(uv0 * 2.0 - 1.0, 0.0, 0.0) / ratio;\n  vec3 lightDirections = vec3(0.0, 0.0, 650.0);\n\n\n  float r = sqrt(dot(p.xy, p.xy));\n  vec3 c;\n  float a;\n\n  p.z = sqrt(1.0 - r * r);\n  \n  \n\n  //\n  float lx=-pos.x*0.01;\n  float ly=pos.y*0.01;\n  float lz=lightDirections.z*0.01;\n\n  vec3 lights = vec3(lx,ly,lz);//\u52A8\u6001\n  lights=normalize(lights);\n  float light = max(0.0,dot(p.xyz, lights));\n  light = smoothstep(-0.5,1.0,light);\n   vec3 lightSpecular = specular*light;\n  //\n\n  /*\n  * Rotate p\n  */\n\n  p *= rotationMatrix;\n\n  /**\n  * Calculate r after rotation\n  */\n  float r1 = sqrt(dot(p.xy, p.xy));\n  float r2 = sqrt(dot(p.xz, p.xz));\n\n  /**\n  * Calculate phy\n  */\n  float phy = asin(abs(p.x / r2));\n\n  if (p.z < 0.0) { phy = PI - phy; }\n  if (p.x < 0.0) { phy = -phy; }\n\n  /**\n  * Calculate theta\n  */\n  float theta = asin(p.y);\n\n  /**\n  * Calculate uv\n  */\n  vec2 uv = vec2(phy / PI, theta / (0.5 * PI)) * 0.5 + 0.5;\n\n  c = texture2D(ballTexture, uv).rgb * lightSpecular*vAmbient;\n\n  a = (1.0 - smoothstep(0.87, 1.0 / ratio, r)) * (1.0 - smoothstep(0.93, 0.96, r));\n\n  // return (vec4(uv.x, uv.y, 0.0, 1.0));\n  return vec4(c, a);\n}\n\nvec4 highlightColor() {\n  vec4 p = vec4(uv0 * 2.0 - 1.0, 0.0, 0.0) / ratio;\n\n  float r = sqrt(dot(p.xy, p.xy));\n  vec3 c;\n  float a;\n\n\n  float aperture = 330.0;\n  float apertureHalf = 0.45 * aperture * (PI / 180.0);\n  float maxFactor = apertureHalf;\n  \n  vec2 uv;\n  vec2 xy = 2.0 * uv0.xy - 1.0;\n  float d = length(xy);\n\n  \n    // d = length(xy * maxFactor);\n    // float z = sqrt(1.0 - d * d);\n    // float rs = atan(d, z) / PI;\n    // float phi = atan(xy.y, xy.x);\n    \n    // uv.x = rs * cos(phi) + 0.5;\n    // uv.y = rs * sin(phi) + 0.5;\n\n\n    if (d < (6.0-maxFactor))\n    {\n      d = length(xy * maxFactor);\n      float z = sqrt(1.0 - d * d);\n      float rs = atan(d, z) / PI;\n      float phi = atan(xy.y, xy.x);\n      \n      uv.x = rs * cos(phi) + 0.5;\n      uv.y = rs * sin(phi) + 0.5;\n    }\n    else\n    {\n      uv = uv0.xy;\n    }\n  \n \n  //\n\n  float ts = 0.0004;\n  float lx = pos.x*(ts+0.0003);\n  float ly = pos.y*(ts+0.0001);\n  \n\n\n  float ux = uv.x+lx;\n  float uy = uv.y-ly;\n \n\n  vec2 fe=vec2(ux,uy);  \n  // vec2 fe = (uv0 - 0.5) / ratio + 0.5;\n\n\n\n  \n\n  c = texture2D(highlight, fe).rgb*0.5;\n\n  a = (1.0 - smoothstep(0.9, 1.0 / ratio, r)) * (1.0 - smoothstep(0.93, 0.96, r));\n  //\n  vec2 uz = (uv0*2.0-1.0)*2.0;\n  vec3 pc =vec3(uz,-1.0);\n  float hx=pos.x;\n  float hy=-pos.y;\n  float hz=pos.z*0.001;\n\n  vec3 lightangle = vec3(hx,hy,hz);//\u52A8\u6001\n  vec3 lightDir=normalize(lightDirection-lightangle);\n  float proj = dot(pc,lightDir);\n  float l = length(pc);\n  float dist = sqrt(l * l - proj * proj);\n  a *=(1.0-pow(dist, 5.0));\n  a = smoothstep(0.1,1.0,a);\n  return vec4(c,a);\n\n\n}\n\nvec4 shadowColor() {\n  //\u6563\u5C04\u5149\u5F3A\u5EA6\u548C\u989C\u8272\n  vec3 diffuseColor = vec3(1.0);\n  float diffuseIntensity = 1.5;\n  //\u73AF\u5883\u5149\u5F3A\u5EA6\u548C\u989C\u8272\n  vec3 ambientColor = vec3(1.0);\n  float ambientIntensity = 0.2;\n\n  vec4 color = vec4(1.0,1.0,1.0,0.0);\n  vec4 color1 = vec4(0.0,0.0,0.0,1.0);\n  vec2 uv = (uv0*2.0-1.0)*2.0;\n  vec3 p =vec3(uv,-1.0);\n  //\n  float lx=pos.x;\n  float ly=-pos.y;\n  float lz=pos.z*0.001;\n\n  vec3 lightangle = vec3(lx,ly,lz);//\u52A8\u6001\n\n\n  //\n  vec3 normal = vec3(0.0, 0.0, 1.0);\n  vec3 diffuse;\n  vec3 lightDir=normalize(lightDirection-lightangle);\n  vec3 ambient = ambientColor * ambientIntensity;\n  \n\n\n  float proj = dot(p,lightDir);\n  float l = length(p);\n  float dist = sqrt(l * l - proj * proj);\n\n  diffuse = diffuseColor * diffuseIntensity * dot(normal, lightDir);\n  if (dist < 1.0) { diffuse *= pow(dist, 4.0); }\n  color1.rgb *= (ambient + diffuse);\n  \n  \n  color1.a= 1.0-(color1.a*pow(dist, 1.8));\n  color1.a = smoothstep(-0.5,0.9,color1.a);\n\n  \n  return color1;\n}\nvec4 shadowColor1() {\n  float a = 1.0 - smoothstep(0.2, 0.45, length(uv0 - 0.5));\n  vec4 c = vec4(vec3(0.0), a * 0.3);\n  return c;\n}\nvec4 highlightColor1() {\n  vec2 uv = (uv0 - 0.5) / ratio + 0.5;\n  vec4 c = texture2D(highlight, uv);\n  return c;\n}\n\n\n\n\nvoid main(void) {\n  vec4 b = ballColor();\n  vec4 s = shadowColor1();\n  vec4 h = highlightColor1();\n  // vec4 c = clamp(mix(s, b, b.a), 0.0, 1.0) + h * h.a * 0.5;\n  vec4 c = clamp(mix(s, b, b.a), 0.0, 1.0);\n\n\n\n\n  // gl_FragColor = vec4(1.0,1.0,1.0,0.5);\n  gl_FragColor = c;\n}\n';

var shader = { name: 'TexturedBall', defines: [], vert: vert, frag: frag };

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
        //# sourceMappingURL=TexturedBallShader.js.map
        