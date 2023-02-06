import { Scene } from "@/types/scene";

export default class Shader {
    shaderProgram: WebGLProgram;
    gl: WebGLRenderingContext;
    attributes: Record<string, number>;
    uniforms: Record<string, WebGLUniformLocation>;

    scene: Scene;

    constructor(scene: Scene, gl: WebGLRenderingContext) {
        this.scene = scene;
        this.gl = gl;
        this.compile();
        this.createVariable();
    }

    _compile(
        type: WebGLRenderingContextBase["SHADER_TYPE"],
        source: string
    ): WebGLShader {
        const shader = this.gl.createShader(type);
        if (!shader) {
            throw new Error("Error creating the shader");
        }

        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            const errorLog = this.gl.getShaderInfoLog(shader);
            this.gl.deleteShader(shader);
            throw new Error(`Error compiling the shader: \n${errorLog}`);
        }

        return shader;
    }

    compile(): WebGLProgram {
        const vertexShader: WebGLShader = this._compile(
            this.gl.VERTEX_SHADER,
            this.scene.vertex
        );

        const fragmentShader: WebGLShader = this._compile(
            this.gl.FRAGMENT_SHADER,
            this.scene.fragment
        );

        const program = this.gl.createProgram();
        if (!program) {
            throw new Error("Error while creating the shader program");
        }

        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);

        this.gl.linkProgram(program);

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            const errorLog = this.gl.getProgramInfoLog(program);
            throw new Error(`Error while linking the program : \n ${errorLog}`);
        }

        this.shaderProgram = program;
        return program;
    }

    createVariable() {
        const _attributes: Record<string, number> = {};
        this.scene.attributes.forEach((attrib) => {
            _attributes[attrib] = this.gl.getAttribLocation(
                this.shaderProgram,
                attrib
            );
        });

        this.attributes = _attributes;

        const _uniforms: Record<string, WebGLUniformLocation> = {};
        this.scene.uniforms.forEach((unif) => {
            const tmp = this.gl.getUniformLocation(this.shaderProgram, unif);
            if (!tmp) {
                throw new Error("Error while getting an uniform location");
            }
            _uniforms[unif] = tmp;
        });

        this.uniforms = _uniforms;
    }
}
