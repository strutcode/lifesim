attribute vec4 position;
attribute vec2 texcoord;

varying vec2 v_texcoord;

uniform mat4 u_view;
uniform vec2 u_pos;

void main() {
  v_texcoord = texcoord;
  gl_Position = u_view * (position + vec4(u_pos, 0, 0));
}
