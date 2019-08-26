const vert = `
uniform mat4 viewProj;
uniform mat4 model;
attribute vec3 a_position;
attribute vec2 a_uv0;
varying vec2 uv0;
varying vec4 pos;

void main () {
  mat4 mvp = viewProj * model;

  pos = mvp * vec4(a_position, 1);
  gl_Position = pos;
  uv0 = a_uv0;
}
`;

const frag = `
uniform sampler2D iTexture;
uniform sampler2D ballTexture;
uniform sampler2D highlight;
uniform mat4 rotationMatrix;
uniform float ratio;

varying vec2 uv0;
varying vec4 pos;

float PI = 3.1415926535897932384626433832795;
vec3 lightDirection = vec3(0.0, 0.0, 1500.0);
vec3 specular = vec3(0.7,0.7,0.65);
vec3 vAmbient = vec3(1.25,1.25,1.25);

vec4 ballColor() {
  vec4 p = vec4(uv0 * 2.0 - 1.0, 0.0, 0.0) / ratio;
  vec3 lightDirections = vec3(0.0, 0.0, 650.0);


  float r = sqrt(dot(p.xy, p.xy));
  vec3 c;
  float a;

  p.z = sqrt(1.0 - r * r);
  
  

  //
  float lx=-pos.x*0.01;
  float ly=pos.y*0.01;
  float lz=lightDirections.z*0.01;

  vec3 lights = vec3(lx,ly,lz);//动态
  lights=normalize(lights);
  float light = max(0.0,dot(p.xyz, lights));
  light = smoothstep(-0.5,1.0,light);
   vec3 lightSpecular = specular*light;
  //

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
  vec2 uv = vec2(phy / PI, theta / (0.5 * PI)) * 0.5 + 0.5;

  c = texture2D(ballTexture, uv).rgb * lightSpecular*vAmbient;

  a = (1.0 - smoothstep(0.87, 1.0 / ratio, r)) * (1.0 - smoothstep(0.93, 0.96, r));

  // return (vec4(uv.x, uv.y, 0.0, 1.0));
  return vec4(c, a);
}

vec4 highlightColor() {
  vec4 p = vec4(uv0 * 2.0 - 1.0, 0.0, 0.0) / ratio;

  float r = sqrt(dot(p.xy, p.xy));
  vec3 c;
  float a;


  float aperture = 330.0;
  float apertureHalf = 0.45 * aperture * (PI / 180.0);
  float maxFactor = apertureHalf;
  
  vec2 uv;
  vec2 xy = 2.0 * uv0.xy - 1.0;
  float d = length(xy);

  
    // d = length(xy * maxFactor);
    // float z = sqrt(1.0 - d * d);
    // float rs = atan(d, z) / PI;
    // float phi = atan(xy.y, xy.x);
    
    // uv.x = rs * cos(phi) + 0.5;
    // uv.y = rs * sin(phi) + 0.5;


    if (d < (6.0-maxFactor))
    {
      d = length(xy * maxFactor);
      float z = sqrt(1.0 - d * d);
      float rs = atan(d, z) / PI;
      float phi = atan(xy.y, xy.x);
      
      uv.x = rs * cos(phi) + 0.5;
      uv.y = rs * sin(phi) + 0.5;
    }
    else
    {
      uv = uv0.xy;
    }
  
 
  //

  float ts = 0.0004;
  float lx = pos.x*(ts+0.0003);
  float ly = pos.y*(ts+0.0001);
  


  float ux = uv.x+lx;
  float uy = uv.y-ly;
 

  vec2 fe=vec2(ux,uy);  
  // vec2 fe = (uv0 - 0.5) / ratio + 0.5;



  

  c = texture2D(highlight, fe).rgb*0.5;

  a = (1.0 - smoothstep(0.9, 1.0 / ratio, r)) * (1.0 - smoothstep(0.93, 0.96, r));
  //
  vec2 uz = (uv0*2.0-1.0)*2.0;
  vec3 pc =vec3(uz,-1.0);
  float hx=pos.x;
  float hy=-pos.y;
  float hz=pos.z*0.001;

  vec3 lightangle = vec3(hx,hy,hz);//动态
  vec3 lightDir=normalize(lightDirection-lightangle);
  float proj = dot(pc,lightDir);
  float l = length(pc);
  float dist = sqrt(l * l - proj * proj);
  a *=(1.0-pow(dist, 5.0));
  a = smoothstep(0.1,1.0,a);
  return vec4(c,a);


}

vec4 shadowColor() {
  //散射光强度和颜色
  vec3 diffuseColor = vec3(1.0);
  float diffuseIntensity = 1.5;
  //环境光强度和颜色
  vec3 ambientColor = vec3(1.0);
  float ambientIntensity = 0.2;

  vec4 color = vec4(1.0,1.0,1.0,0.0);
  vec4 color1 = vec4(0.0,0.0,0.0,1.0);
  vec2 uv = (uv0*2.0-1.0)*2.0;
  vec3 p =vec3(uv,-1.0);
  //
  float lx=pos.x;
  float ly=-pos.y;
  float lz=pos.z*0.001;

  vec3 lightangle = vec3(lx,ly,lz);//动态


  //
  vec3 normal = vec3(0.0, 0.0, 1.0);
  vec3 diffuse;
  vec3 lightDir=normalize(lightDirection-lightangle);
  vec3 ambient = ambientColor * ambientIntensity;
  


  float proj = dot(p,lightDir);
  float l = length(p);
  float dist = sqrt(l * l - proj * proj);

  diffuse = diffuseColor * diffuseIntensity * dot(normal, lightDir);
  if (dist < 1.0) { diffuse *= pow(dist, 4.0); }
  color1.rgb *= (ambient + diffuse);
  
  
  color1.a= 1.0-(color1.a*pow(dist, 1.8));
  color1.a = smoothstep(-0.5,0.9,color1.a);

  
  return color1;
}
vec4 shadowColor1() {
  float a = 1.0 - smoothstep(0.2, 0.45, length(uv0 - 0.5));
  vec4 c = vec4(vec3(0.0), a * 0.3);
  return c;
}
vec4 highlightColor1() {
  vec2 uv = (uv0 - 0.5) / ratio + 0.5;
  vec4 c = texture2D(highlight, uv);
  return c;
}




void main(void) {
  vec4 b = ballColor();
  vec4 s = shadowColor1();
  vec4 h = highlightColor1();
  // vec4 c = clamp(mix(s, b, b.a), 0.0, 1.0) + h * h.a * 0.5;
  vec4 c = clamp(mix(s, b, b.a), 0.0, 1.0);




  // gl_FragColor = vec4(1.0,1.0,1.0,0.5);
  gl_FragColor = c;
}
`;

const shader = { name: 'TexturedBall', defines: [], vert, frag, };

cc.game.once(cc.game.EVENT_ENGINE_INITED, function () {
  cc.renderer._forward._programLib.define(
    shader.name,    // name
    shader.vert,    // vertex shader source code
    shader.frag,    // fragment shader source code
    shader.defines  // defines - affects shader #define so that shader code canbe modified by #ifdef programatically
  );
});

module.exports = shader;
