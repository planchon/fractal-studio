#version 300 es
        precision highp float;

        out vec4 outColour;

        uniform sampler2D tex;

        in vec2 vPos;

        #define AA 4
        #define OPTI 1

        float mandlebrot(vec2 c) {
            #if OPTI
            {
                float c2 = dot(c, c);
                // skip computation inside M1 - https://iquilezles.org/articles/mset1bulb
                if( 256.0*c2*c2 - 96.0*c2 + 32.0*c.x - 3.0 < 0.0 ) return 0.0;
                // skip computation inside M2 - https://iquilezles.org/articles/mset2bulb
                if( 16.0*(c2+2.0*c.x+1.0) - 1.0 < 0.0 ) return 0.0;
            }
            #endif

            const float B = 256.0;

            float n = 0.0;
            vec2 z = vec2(0.0);
            for (int i = 0; i < 512; i++) {
                z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
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
            for (int i = int(-AA/2.0); i < int(AA/2); i++) {
                for (int j = -int(AA/2.0); j < int(AA/2); j++) {
                    vec2 p = xy + vec2(float(i) / , float(j)) / float(AA);
                    vec2 c = vec2(-.745,.186) + p;

                    float l = mandlebrot(c);
                    col += 0.5 + 0.5*cos( 3.0 + l*0.15 + vec3(0.0,0.6,1.0));
                }
            }

            col /= float(AA * AA);

            outColour = vec4(col, 1.0);
        }