/**
 * Halftone reveal — the site's visual signature.
 *
 * Injected into every watch material via onBeforeCompile. When uReveal = 0
 * the product renders as a square dot-matrix whose dot radius follows the
 * lit luminance (and whose gaps are transparent, so the page shows through).
 * As uReveal → 1 an ordered-dither (Bayer 8×8) front sweeps down the screen,
 * resolving cell by cell into the full PBR render.
 */
export const halftoneUniforms = {
  uReveal: { value: 0 },
  uDot: { value: 7 }, // cell size in device pixels (scaled by DPR at runtime)
  uRes: { value: [1, 1] },
}

const PARS = /* glsl */ `
uniform float uReveal;
uniform float uDot;
uniform vec2 uRes;
float htBayer2(vec2 a){ a = floor(a); return fract(a.x / 2. + a.y * a.y * .75); }
#define htBayer4(a) (htBayer2(.5 * (a)) * .25 + htBayer2(a))
#define htBayer8(a) (htBayer4(.5 * (a)) * .25 + htBayer2(a))
`

const MAIN = /* glsl */ `
if (uReveal < 0.999) {
  vec2 cell = floor(gl_FragCoord.xy / uDot);
  vec2 f = fract(gl_FragCoord.xy / uDot) - .5;
  float lum = dot(gl_FragColor.rgb, vec3(.2126, .7152, .0722));
  lum = clamp(pow(lum * 1.35, .75), 0., 1.);
  float r = sqrt(lum) * .6;
  float aa = 1.5 / uDot;
  float dotMask = 1. - smoothstep(r - aa, r + aa, length(f));
  // sweep from the top of the viewport, with a dithered edge
  float s = 1. - gl_FragCoord.y / uRes.y;
  float thresh = s * .82 + htBayer8(cell) * .18;
  float t = uReveal * 1.04 - .02;
  float photo = step(thresh, t);
  float edge = (1. - smoothstep(0., .035, abs(thresh - t))) * (1. - photo);
  vec3 ink = mix(vec3(.93, .92, .9), vec3(1., .42, .16), edge);
  vec4 ht = vec4(ink * dotMask, dotMask);
  gl_FragColor = mix(ht, gl_FragColor, photo);
}
`

export function applyHalftone(material) {
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, halftoneUniforms)
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${PARS}`)
      .replace('#include <dithering_fragment>', `#include <dithering_fragment>\n${MAIN}`)
  }
  material.customProgramCacheKey = () => `halftone-${material.type}`
  return material
}
