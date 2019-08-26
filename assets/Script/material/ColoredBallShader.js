const vert = `
uniform mat4 viewProj;
uniform mat4 model;
attribute vec3 a_position;
attribute vec2 a_uv0;
varying vec2 uv0;
void main () {
  mat4 mvp;
  mvp = viewProj * model;

  vec4 pos = mvp * vec4(a_position, 1);
  gl_Position = pos;
  uv0 = a_uv0;
}
`;

const frag = `
uniform sampler2D highlight;
uniform mat4 rotationMatrix;
uniform vec4 color;
uniform int marker;
uniform float ratio;

varying vec2 uv0;

float PI = 3.1415926535897932384626433832795;
vec3 lightDirection = vec3(0.0, 0.0, 1.0);

vec4 ballColor() {
  vec4 p = vec4(uv0 * 2.0 - 1.0, 0.0, 0.0) / ratio;

  float r = sqrt(dot(p.xy, p.xy));
  vec3 c;
  float a;

    p.z = sqrt(1.0 - r * r);

    float light = dot(p.xyz, lightDirection) * 0.7 + 0.3;

    /*
    * Rotate p
    */

    p *= rotationMatrix;

    /**
    * Calculate r after rotation
    */
    float r1 = sqrt(dot(p.xy, p.xy));
    float r2 = sqrt(dot(p.xz, p.xz));

    /**
    * Calculate phy
    */
    float phy = asin(abs(p.x / r2));

    if (p.z < 0.0) { phy = PI - phy; }
    if (p.x < 0.0) { phy = -phy; }

    /**
    * Calculate theta
    */
    float theta = asin(p.y);

    /**
    * Calculate uv
    */
    vec2 uv = vec2(phy / PI, theta / (0.5 * PI));

    a = 1.0 - smoothstep(0.43, 0.46, abs(uv.y));
    c = color.rgb * a + vec3(1.0 - a);

    if (marker == 1) {
      a = 1.0 - smoothstep(0.18, 0.21, r1);
      c = vec3(1.0, 0.0, 0.0) * a + c * (1.0 - a);
    }

    c *= light;

    // a = 1.0;
    // if (r > 0.87) {
    //   a = -10.0 * r + 9.7 ;
    // }

    // gl_FragColor = vec4(c, a);

  a = 1.0 - smoothstep(0.87, 1.0 / ratio, r);
  a *= 1.0 - smoothstep(0.93, 0.96, r);

  return vec4(c, a);
  // return vec4(r);
}

vec4 highlightColor() {
  vec2 uv = (uv0 - 0.5) / ratio + 0.5;
  vec4 c = texture2D(highlight, uv);
  return c;
}

vec4 shadowColor() {
  float a = 1.0 - smoothstep(0.2, 0.45, length(uv0 - 0.5));
  vec4 c = vec4(vec3(0.0), a * 0.3);
  return c;
}

void main(void) {
  vec4 b = ballColor();
  vec4 s = shadowColor();
  vec4 h = highlightColor();
  vec4 c = clamp(mix(s, b, b.a), 0.0, 1.0) + h * h.a * 0.5;
  gl_FragColor = c;
}
`;

const shader = { name: 'ColoredBall', defines: [], vert, frag, };

cc.game.once(cc.game.EVENT_ENGINE_INITED, function () {
  cc.renderer._forward._programLib.define(
    shader.name,    // name
    shader.vert,    // vertex shader source code
    shader.frag,    // fragment shader source code
    shader.defines  // defines - affects shader #define so that shader code canbe modified by #ifdef programatically
  );
});

module.exports = shader;
