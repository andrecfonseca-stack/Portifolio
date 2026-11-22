/* Switch Opener stickman — uses window.RIG from /scenes/stick.js.
 * - While the switch is OFF (`isOn === false`): the stickman stands calmly next to the switch
 *   with ZERO lightbulb above his head.
 * - ONLY AFTER pressing the switch button (`isOn === true`): the stickman presses the button,
 *   sparks in terracotta, and pops the glowing mini lightbulb above his head ("tive uma ideia!").
 */
(function () {
  const R = window.RIG;
  if (!R) return;

  const { P, mix, breathe, fig, sparks, ln, circle, inkFill, E, seg, clamp, pulse } = R;

  // Standing calm ready pose (facing right toward the switch, no lightbulb)
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

  // Hand lifted, pressing the ON rocker paddle
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

  function drawMiniLightbulb(g, cx, cy, s, popK, pulseT, ink, pen) {
    if (popK <= 0.01) return;
    g.save();
    g.translate(cx, cy);
    g.scale(s * popK, s * popK);

    const glowR = 12 + Math.sin(pulseT * 5) * 1.2;
    g.save();
    g.globalAlpha = 0.34 * clamp(popK, 0, 1);
    circle(g, 0, -3, glowR);
    g.fillStyle = '#FCD34D';
    g.fill();
    g.restore();

    g.beginPath();
    g.arc(0, -4.5, 6.4, Math.PI * 0.78, Math.PI * 0.22, false);
    g.quadraticCurveTo(3.6, 2.2, 2.8, 4.2);
    g.lineTo(-2.8, 4.2);
    g.quadraticCurveTo(-3.6, 2.2, -4.9, -0.4);
    g.closePath();
    inkFill(g, '#FEF3C7', 1.5, ink);

    g.strokeStyle = pen;
    g.lineWidth = 1.3;
    g.lineCap = 'round';
    g.beginPath();
    g.moveTo(-1.8, 3.2);
    g.lineTo(-1.4, -2.5);
    g.arc(0, -3.5, 1.5, Math.PI, 0, false);
    g.lineTo(1.8, 3.2);
    g.stroke();

    ln(g, -2.6, 6.0, 2.6, 6.0, 1.4, ink);
    ln(g, -1.9, 8.0, 1.9, 8.0, 1.4, ink);

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
   * Renders the stickman next to the 3D switch:
   *  - When `isOn === false`: calm breathing STAND pose, NO lightbulb!
   *  - When `isOn === true`: `T` counts seconds since the button was pressed:
   *      0.00..0.38s: presses the ON button with terracotta sparks
   *      0.75s+     : as "André Cavalcanti" appears, the mini lightbulb pops above his head!
   */
  function drawSwitchOpener(g, opts) {
    const { T, t, isOn, xPress, y, scale, ink, far, pen } = opts;

    let pose = STAND;

    if (isOn) {
      const liftK = E.soft(seg(T, 0.0, 0.16)) * (1 - E.soft(seg(T, 0.42, 0.72)));
      const pressK = E.out3(seg(T, 0.12, 0.32)) * (1 - E.soft(seg(T, 0.40, 0.68)));
      const eurekaK = E.soft(seg(T, 0.72, 1.02)) * (1 - E.soft(seg(T, 2.0, 2.5)));
      const settleK = E.soft(seg(T, 0.55, 1.0));

      pose = mix(pose, READY_PRESS, liftK);
      pose = mix(pose, PRESS_DOWN, pressK);
      pose = mix(pose, PROUD, settleK);
      pose = mix(pose, EUREKA, eurekaK);
    } else {
      const glance = pulse(t, 4.8, 1.4, 1.1);
      if (glance > 0.01) {
        pose = P({ head: [pose.head[0] + glance * 3, pose.head[1] + glance * 1.5] }, pose);
      }
    }

    pose = breathe(pose, t, 0.85);

    const J = fig(g, pose, xPress, y, {
      s: scale,
      sx: 1,
      ink,
      far,
      shadow: true,
      floor: y,
    });

    // Strictly draw sparks & lightbulb ONLY when the switch button is ON (isOn === true)!
    if (isOn) {
      const spK = seg(T, 0.18, 0.62);
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

      // Lightbulb pops ONLY after the button is pressed and "André Cavalcanti" starts appearing (T >= 0.75s)
      if (T >= 0.75) {
        const bulbIn = E.back(seg(T, 0.75, 1.12));
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
    }

    return J;
  }

  const SC = (window.SCENES = window.SCENES || {});
  SC['switch-opener'] = {
    dur: 2.8,
    width: 220,
    label: 'Stickman aguarda ao lado do interruptor OFF; ao apertar o botão ON, acende uma mini lâmpada de ideia sobre a cabeça.',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : 0;
      drawSwitchOpener(g, {
        T,
        t: S.t,
        isOn: S.on,
        xPress: -8,
        y: 0,
        scale: 0.78,
        ink: '#242426',
        far: '#737373',
        pen: '#A93F21',
      });
    },
  };

  window.SWITCH_OPENER = {
    drawSwitchOpener,
  };
})();
