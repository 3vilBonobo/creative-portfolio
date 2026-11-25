# Known limitations — DO NOT AUTO-INTEGRATE

1. **Continuation:** Both bases still have a physical floor / dark horizontal lower edge. They require a tested, visually compatible continuation treatment. The 3871px mobile page cannot stretch the portrait plate.
2. **Lamp anchor deviation:** desktop actual center ~78.1%,12.8% vs proposed 80%,8%; mobile ~77.6%,4.4% vs proposed 84%,5%. Confirm acceptable or request artwork revision; CSS offsets of masks alone would break alignment.
3. **Visual/lighting quality:** emission and spill passes are approximations crafted from inspected fixture regions, not artist-grade hand-matted photometric relighting. Validate on and off states at pixel zoom and actual project UI.
4. **Responsive source fidelity:** desktop and portrait were generated separately, so architectural identity is related but not an exact geometric extension.
5. **Master detail:** only 1x image-generation sources exist; no true 2x high-definition master.
6. No runtime integration, browser test, accessibility audit, or user approval of the mobile scene has occurred.
