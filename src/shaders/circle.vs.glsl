attribute vec4 position;
attribute vec2 texcoord;

varying vec2 v_texcoord;

uniform mat4 u_view;

void main() {
  v_texcoord = texcoord;
  gl_Position = u_view * position;
}
