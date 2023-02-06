import { Scene } from "@/types/scene";
import Shader from "./shader";
import { Texture } from "./texture";

const SQUARE_VERTEX = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];

export class WebGL {
    gl: WebGLRenderingContext;
    shader: Shader;
    scene: Scene;

    positionBuffer: WebGLBuffer;
    requestId: number;

    canvas: HTMLCanvasElement;
    width: number;
    height: number;

    constructor(
        canvas: HTMLCanvasElement,
        width: number,
        height: number,
        scene: Scene
    ) {
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.scene = scene;
    }

    async init() {
        const gl = this.canvas.getContext("webgl2");
        if (!gl) {
            throw new Error("No WEBGL context");
        }

        this.canvas.addEventListener("mousedown", (event) => {
            console.log(event);
        });

        this.gl = gl;
        this.shader = new Shader(this.scene, this.gl);
        this.buildBuffers();

        const test = new Texture("/pal.png", this.gl);
        await test.init();

        this.render = this.render.bind(this);
        this.requestId = requestAnimationFrame(this.render);
    }

    render() {
        const { gl } = this;

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(
            this.shader.attributes["aVertexPosition"],
            2,
            gl.FLOAT,
            false,
            0,
            0
        );
        gl.enableVertexAttribArray(this.shader.attributes["aVertexPosition"]);

        gl.useProgram(this.shader.shaderProgram);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        requestAnimationFrame(this.render);
    }

    buildBuffers() {
        const { gl } = this;
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(SQUARE_VERTEX),
            gl.STATIC_DRAW
        );

        if (!positionBuffer) {
            throw new Error("Error while creating the position buffer");
        }

        this.positionBuffer = positionBuffer;
    }

    close() {
        cancelAnimationFrame(this.requestId);
    }
}
