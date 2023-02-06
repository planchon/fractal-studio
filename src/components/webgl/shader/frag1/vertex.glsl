#version 300 es
precision highp float;
layout (location = 1) in vec2 aVertexPosition;

out vec2 vPos;

void main(void) {
    gl_Position = vec4(aVertexPosition, 0, 1);
    vPos = aVertexPosition;
}