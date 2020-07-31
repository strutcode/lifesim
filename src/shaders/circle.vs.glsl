attribute vec4 position;
attribute vec2 texcoord;

varying vec2 v_texcoord;

uniform mat4 u_view;
uniform vec2 u_pos;
uniform float u_size;

void main() {
  v_texcoord = texcoord;

  float s = u_size;
  mat4 scale = mat4(
    s, 0, 0, 0,
    0, s, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  );

  gl_Position = u_view * (position * scale + vec4(u_pos, 0, 0));
}
