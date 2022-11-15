// Shaders for Fill Color
export const vs_fill = `
    attribute    vec4    a_Vertex;
    uniform      mat4    u_PMVMatrix;
    void main (void)
    {
        gl_Position = u_PMVMatrix * a_Vertex;
    }
    `;

export const fs_fill = `
    precision mediump float;
    uniform      vec4    u_Color;

    void main (void)
    {
        gl_FragColor = u_Color;
    }
`;

// Shaders for Texture
export const vs_tex = `
    attribute    vec4    a_Vertex;
    attribute    vec2    a_TexCoord;
    varying      vec2    v_TexCoord;
    uniform      mat4    u_PMVMatrix;

    void main (void)
    {
        gl_Position = u_PMVMatrix * a_Vertex;
        v_TexCoord  = a_TexCoord;
    }
`;

export const fs_tex = `
    precision mediump float;
    varying     vec2      v_TexCoord;
    uniform     sampler2D u_sampler;
    uniform     vec4      u_Color;

    void main (void)
    {
        gl_FragColor = texture2D (u_sampler, v_TexCoord);
        gl_FragColor *= u_Color;
    }
`;

// Shaders for Face mesh

export const strVS = `
attribute vec4  a_Vertex;
attribute vec2  a_TexCoord;
attribute float a_vtxalpha;
uniform   mat4  u_PMVMatrix;
varying   vec2  v_texcoord;
varying   float v_vtxalpha;

void main(void)
{
    gl_Position = u_PMVMatrix * a_Vertex;
    v_texcoord  = a_TexCoord;
    v_vtxalpha  = a_vtxalpha;
}
`;

export const strFS = `
precision mediump float;

uniform vec3    u_color;
uniform float   u_alpha;
varying vec2    v_texcoord;
varying float   v_vtxalpha;
uniform sampler2D u_sampler;

void main(void)
{
    vec3 color;
    color = vec3(texture2D(u_sampler, v_texcoord));
    color *= u_color;
    gl_FragColor = vec4(color, v_vtxalpha * u_alpha);
}
`;
