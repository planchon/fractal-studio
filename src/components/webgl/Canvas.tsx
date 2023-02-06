"use client";
import { Scene } from "@/types/scene";
import styled from "@emotion/styled";
import { useContext, useEffect, useRef } from "react";
import { CodeContext } from "../../context/code";
import { WebGL } from "./webgl";

const scene: Scene = {
    fragment: `#version 300 es
        precision highp float;

        out vec4 outColour;

        uniform sampler2D tex;

        const vec2 screenRes = vec2(1280.0, 720.0);
        in vec2 vPos;

        #define AA 2

        float mandlebrot(vec2 c) {
            const float B = 256.0;

            float n = 0.0;
            vec2 z = vec2(0.0);
            for (int i = 0; i < 512; i++) {
                z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
                // float a = z.x;
                // float b = z.y;
                // float d = c.x;
                // float e = c.y;
                
                // z = vec2(d * a - e * b + a - b + d, e * a + d * b + e + a + b);
                if (dot(z, z) > B * B) break;
                n += 1.0;
            }

            if (n > 511.0) return 0.0;

            float sn = n - log(log(length(z))/log(B))/log(2.0);

            return sn;
        }

        void main() {
            vec2 xy = gl_FragCoord.xy;
            vec3 col = vec3(0.0);
            float AAf = float(AA);
            for (int i = int(-AAf/2.0); i < int(AAf/2.0); i++) {
                for (int j = -int(AAf/2.0); j < int(AAf/2.0); j++) {
                    vec2 p = (-screenRes + 2.0*(xy + vec2(float(i), float(j)) / AAf)) / screenRes.y;
                    vec2 c = vec2(-.745,.186) + p;

                    float l = mandlebrot(c) / 2.0;
                    // col += texture(tex, vec2(l, 0.5)).xyz;
                    col += 0.5 + 0.5*cos( 3.0 + l*0.15 + vec3(0.0,0.6,1.0));
                }
            }

            col /= float(AA * AA);

            outColour = vec4(col, 1.0);
        }
    `,
    vertex: `#version 300 es
        precision highp float;
        layout (location = 1) in vec2 aVertexPosition;

        out vec2 vPos;

        void main(void) {
            gl_Position = vec4(aVertexPosition, 0, 1);
            vPos = aVertexPosition;
        }
    `,
    attributes: ["aVertexPosition"],
    uniforms: [],
};

const height = 450;
const width = Math.floor((height * 16) / 9);

const FloattingCanvas = styled.div`
    margin-top: 30px;
    border-radius: 10px;
    overflow: hidden;
    width: ${width}px;
    height: ${height}px;
`;

export default function Canvas() {
    const { code } = useContext(CodeContext);
    let rawCanvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = rawCanvas.current;
        if (!canvas) {
            console.log("canvas empty?");
            return;
        }

        if (code) {
            scene.fragment = code;
        }

        const webGL = new WebGL(canvas, width, height, scene);
        webGL.init();

        return () => {
            webGL.close();
        };
    }, [code]);

    return (
        <FloattingCanvas>
            <canvas ref={rawCanvas} width={width} height={height} />
        </FloattingCanvas>
    );
}
