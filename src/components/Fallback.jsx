/** Static presentation used when WebGL is unavailable or the model fails. */
export function Fallback({ reason }) {
  return (
    <>
      <div className="fallback" aria-hidden="true">
        <img src="/fallback/watch-hero.webp" alt="" width="900" height="1100" decoding="async" />
      </div>
      <p className="notice label" role="note">
        {reason === 'unsupported'
          ? 'WebGL isn’t available in this browser, so you’re seeing a static render. All content is still here.'
          : 'The 3D model couldn’t be loaded, so you’re seeing a static render. All content is still here.'}
      </p>
    </>
  )
}
