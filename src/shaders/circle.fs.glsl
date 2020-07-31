precision mediump float;

varying vec2 v_texcoord;

uniform vec4 u_color;

void main() {
  float distance = distance(v_texcoord, vec2(0.5));

  if (distance < 0.5) {
    gl_FragColor = mix(u_color, vec4(0), distance * 2.0);
  }
  else {
    discard;
  }
}
