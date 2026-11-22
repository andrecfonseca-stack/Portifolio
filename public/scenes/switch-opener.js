/* Switch Opener stickman — uses window.RIG from /scenes/stick.js.
 * 1. Walks up to the 3D rocker switch and presses the "ON" side (T = 0.88s).
 * 2. When the author's name "André Cavalcanti" starts appearing (T = 1.62s),
 *    pops a hand-drawn mini lightbulb above the stickman's head ("tive uma ideia!").
 */
(function () {
  const R = window.RIG;
  if (!R) return;

  const { P, mix, breathe, legs, walkSeg, fig, sparks, ln, circle, inkFill, E, seg, clamp, pulse } = R;

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

  // Pressing cleanly forward & down onto the ON paddle
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

  // "Eureka / Tive uma ideia!" pose while the mini lightbulb pops above the head
  const EUREKA = P({
    head: [3, -118],
    chest: [1, -91],
    hip: [0, -59],
    hF: [18, -108],
    hB: [-5, -52],
    fF: [6, -2.5],
    fB: [-6, -2.5],
    kF: [24, -32],
    kB: [12, -32],
    ef: 1,
    eb: 1,
  });

  // Relaxed admiring stance after the sequence completes
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
   * Draws a hand-drawn mini lightbulb ("tive uma ideia!") above the stickman's head at (cx, cy).
   */
  function drawMiniLightbulb(g, cx, cy, s, popK, pulseT, ink, pen) {
    if (popK <= 0.01) return;
    g.save();
    g.translate(cx, cy);
    g.scale(s * popK, s * popK);

    // Subtle warm glow behind the bulb glass
    const glowR = 12 + Math.sin(pulseT * 5) * 1.2;
    g.save();
    g.globalAlpha = 0.34 * clamp(popK, 0, 1);
    circle(g, 0, -3, glowR);
    g.fillStyle = '#FCD34D';
    g.fill();
    g.restore();

    // Bulb glass contour (rounded top tapering into screw base)
    g.beginPath();
    g.arc(0, -4.5, 6.4, Math.PI * 0.78, Math.PI * 0.22, false);
    g.quadraticCurveTo(3.6, 2.2, 2.8, 4.2);
    g.lineTo(-2.8, 4.2);
    g.quadraticCurveTo(-3.6, 2.2, -4.9, -0.4);
    g.closePath();
    inkFill(g, '#FEF3C7', 1.5, ink);

    // Inner glowing filament loop in terracotta pen
    g.strokeStyle = pen;
    g.lineWidth = 1.3;
    g.lineCap = 'round';
    g.beginPath();
    g.moveTo(-1.8, 3.2);
    g.lineTo(-1.4, -2.5);
    g.arc(0, -3.5, 1.5, Math.PI, 0, false);
    g.lineTo(1.8, 3.2);
    g.stroke();

    // Screw base threads
    ln(g, -2.6, 6.0, 2.6, 6.0, 1.4, ink);
    ln(g, -1.9, 8.0, 1.9, 8.0, 1.4, ink);

    // 5 hand-drawn radiating idea rays around the bulb
    const rayAngles = [-Math.PI * 0.88, -Math.PI * 0.68, -Math.PI * 0.5, -Math.PI * 0.32, -Math.PI * 0.12];
    const rayPulse = 0.85 + Math.sin(pulseT * 6) * 0.15;
    for (let i = 0; i < rayAngles.length; i++) {
      const a = rayAngles[i];
      const r0 = 9.2;
      const r1 = r0 + 4.4 * rayPulse;
      ln(
        g,
        Math.cos(a) * r0,
        -4.5 + Math.sin(a) * r0,
        Math.cos(a) * r1,
        -4.5 + Math.sin(a) * r1,
        1.45,
        pen,
      );
    }

    g.restore();
  }

  /**
   * Renders the stickman pressing the switch and popping the idea lightbulb:
   *  - 0.00..0.48s: steps forward toward the switch
   *  - 0.36..0.88s: raises hand and presses switch ON (flips at T = 0.88s)
   *  - 1.62..2.85s: when "André Cavalcanti" appears (+0.78s after 0.88s = 1.66s),
   *                 mini lightbulb pops above head with E.back and stickman perks into EUREKA!
   */
  function drawSwitchOpener(g, opts) {
    const { T, t, xStart, xPress, y, scale, ink, far, pen } = opts;

    const ws = walkSeg(T, 0.0, 0.48, xStart, xPress, scale);
    const liftK = E.soft(seg(T, 0.36, 0.68)) * (1 - E.soft(seg(T, 1.05, 1.45)));
    const pressK = E.out3(seg(T, 0.68, 0.88)) * (1 - E.soft(seg(T, 1.0, 1.35)));
    const eurekaK = E.soft(seg(T, 1.58, 1.88)) * (1 - E.soft(seg(T, 2.75, 3.25)));
    const settleK = E.soft(seg(T, 1.25, 1.75));

    let pose = STAND;
    pose = mix(pose, READY_PRESS, liftK);
    pose = mix(pose, PRESS_DOWN, pressK);
    pose = mix(pose, PROUD, settleK);
    pose = mix(pose, EUREKA, eurekaK);

    const nod = pulse(t, 5.8, 2.4, 1.1) * settleK * (1 - eurekaK);
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

    // Crisp terracotta spark right when the hand clicks the ON paddle (T = 0.86..1.32)
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

    // Mini lightbulb pops above the stickman's head as "André Cavalcanti" writes in (T >= 1.62s)
    const bulbIn = E.back(seg(T, 1.62, 1.98));
    // Stays glowing above head once popped
    if (T >= 1.62) {
      drawMiniLightbulb(
        g,
        J.w.head[0],
        J.w.head[1] - 21 * scale,
        scale * 0.95,
        bulbIn,
        t,
        ink,
        pen,
      );
    }

    return J;
  }

  const SC = (window.SCENES = window.SCENES || {});
  SC['switch-opener'] = {
    dur: 3.4,
    width: 220,
    label: 'Stickman aperta o interruptor e uma mini lâmpada de ideia acende sobre sua cabeça quando o nome aparece.',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : 0;
      drawSwitchOpener(g, {
        T,
        t: S.t,
        xStart: -48,
        xPress: -8,
        y: 0,
        scale: 0.78,
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
