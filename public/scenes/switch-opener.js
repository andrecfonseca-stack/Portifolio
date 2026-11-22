/* Switch Opener stickman — uses window.RIG from /scenes/stick.js.
 * A hand-drawn stick figure walks up to the 3D rocker switch, presses the "ON" side,
 * sparks in terracotta, and settles into a calm breathing stance beside it.
 */
(function () {
  const R = window.RIG;
  if (!R) return;

  const { P, mix, breathe, legs, walkSeg, fig, sparks, E, seg, clamp, pulse } = R;

  // Standing calm ready pose (facing right toward the switch)
  const STAND = P({
    head: [1, -116],
    chest: [0, -90],
    hip: [0, -59],
    hF: [10, -58],
    hB: [-5, -52],
    fF: [5, -2.5],
    fB: [-6, -2.5],
    kF: [24, -32],
    kB: [12, -32],
    ef: 0.9,
    eb: 1,
  });

  // Hand lifted, ready to press the ON rocker paddle
  const READY_PRESS = P({
    head: [7, -114],
    chest: [4, -89],
    hip: [1, -59],
    hF: [26, -104],
    hB: [-5, -54],
    fF: [9, -2.5],
    fB: [-7, -2.5],
    kF: [25, -32],
    kB: [10, -32],
    ef: 0.9,
    eb: 1,
  });

  // Pressing cleanly forward & down onto the ON paddle at ~x+35, y-82
  const PRESS_DOWN = P({
    head: [10, -112],
    chest: [7, -88],
    hip: [2, -59],
    hF: [36, -84],
    hB: [-6, -54],
    fF: [11, -2.5],
    fB: [-8, -2.5],
    kF: [27, -32],
    kB: [9, -32],
    ef: 0.55,
    eb: 1,
  });

  // Small satisfied nod / admiring stance after flipping the switch ON
  const PROUD = P({
    head: [4, -117],
    chest: [0, -90],
    hip: [0, -59],
    hF: [14, -64],
    hB: [-4, -52],
    fF: [5, -2.5],
    fB: [-6, -2.5],
    kF: [24, -32],
    kB: [12, -32],
    ef: 0.9,
    eb: 1,
  });

  /**
   * Renders the stickman pressing the switch over timeline `T` (seconds, 0..2.2s):
   *  - 0.00..0.48s: steps forward toward the switch
   *  - 0.42..0.72s: raises hand to READY_PRESS
   *  - 0.72..0.95s: presses switch down (switch flips ON at T = 0.88s!)
   *  - 0.95..1.45s: holds briefly with spark, then relaxes back to PROUD idle breathing
   */
  function drawSwitchOpener(g, opts) {
    const { T, t, xStart, xPress, y, scale, ink, far, pen } = opts;

    const ws = walkSeg(T, 0.0, 0.48, xStart, xPress, scale);
    const liftK = E.soft(seg(T, 0.36, 0.68)) * (1 - E.soft(seg(T, 1.05, 1.48)));
    const pressK = E.out3(seg(T, 0.68, 0.88)) * (1 - E.soft(seg(T, 1.02, 1.38)));
    const settleK = E.soft(seg(T, 1.25, 1.75));

    let pose = STAND;
    pose = mix(pose, READY_PRESS, liftK);
    pose = mix(pose, PRESS_DOWN, pressK);
    pose = mix(pose, PROUD, settleK);

    // Subtle idle glance/chin-nod once settled
    const nod = pulse(t, 5.8, 2.4, 1.1) * settleK;
    if (nod > 0.01) {
      pose = P({ head: [pose.head[0] + nod * 2.5, pose.head[1] + nod * 1.6] }, pose);
    }

    pose = breathe(pose, t, 0.85);
    if (ws.amp > 0.001) {
      pose = legs(pose, ws.ph, ws.amp, { arms: false, stride: ws.stride });
    }

    const J = fig(g, pose, ws.x, y, {
      s: scale,
      sx: 1,
      ink,
      far,
      shadow: true,
      floor: y,
    });

    // Crisp terracotta spark right when the hand clicks the ON paddle (T = 0.86..1.35)
    const spK = seg(T, 0.86, 1.32);
    if (spK > 0.01 && spK < 0.99) {
      sparks(
        g,
        J.w.handF[0] + 6 * scale,
        J.w.handF[1] - 4 * scale,
        clamp(spK, 0, 1),
        14 * scale,
        5,
        pen,
      );
    }

    return J;
  }

  // Register standalone scene for frames.mjs verification
  const SC = (window.SCENES = window.SCENES || {});
  SC['switch-opener'] = {
    dur: 2.4,
    width: 220,
    label: 'Stickman caminha até o interruptor e pressiona para ligar a apresentação do portfólio.',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : 0;
      drawSwitchOpener(g, {
        T,
        t: S.t,
        xStart: -48,
        xPress: -8,
        y: 0,
        scale: 0.82,
        ink: '#1F1E1C',
        far: '#746E65',
        pen: '#A93F21',
      });
    },
  };

  window.SWITCH_OPENER = {
    drawSwitchOpener,
    FLIP_AT_SEC: 0.88,
  };
})();
