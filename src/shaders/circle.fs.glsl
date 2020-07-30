precision mediump float;

varying vec2 v_texcoord;

uniform vec4 u_color;

void main() {
  if (distance(v_texcoord, vec2(0.5)) < 0.5) {
    gl_FragColor = u_color;
  }
  else {
    gl_FragColor = vec4(0,0,0,1);
  }
}
