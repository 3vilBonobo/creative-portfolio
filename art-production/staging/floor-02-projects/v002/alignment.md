# Alignment

Both light layers are full-canvas RGBA PNGs with the same native dimensions/origin as their corresponding base. Use base z0 / emission z1 / spill z2. Do not independently apply background-size to individual layers.

Fixture centers estimated by inspecting the actual newly generated base pixels (not the originally proposed anchors): desktop (1070,147) -> (0.781,0.128); mobile (596,91) -> (0.776,0.044). These **do not match** v002 requested (0.80,0.08) and (0.84,0.05), respectively. No fixture geometry was moved to avoid introducing artifacts. The masks are constructed at actual fixture locations.

The independent AI-generated overlay images were NOT deployed because their silhouettes differ from the base and registration was unreliable. The supplied passes are deterministic approximations, not measured physically correct relighting. Composite proofs live in previews/.
