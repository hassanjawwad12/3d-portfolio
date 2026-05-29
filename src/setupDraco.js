import { useGLTF } from '@react-three/drei'

// Self-host the Draco decoder (files live in public/draco/) instead of pulling
// it from gstatic.com at runtime. This keeps the production CSP's connect-src
// locked to our own origin and removes a third-party dependency for 3D.
//
// This MUST run before any model module evaluates, because each model calls
// useGLTF.preload() at import time and the decoder path is read synchronously
// at that moment. Keep this imported ahead of <App /> in main.jsx.
useGLTF.setDecoderPath('/draco/')
