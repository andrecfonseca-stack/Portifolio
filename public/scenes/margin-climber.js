/* Margin Climber scene — uses window.RIG from /scenes/stick.js.
 * Provides both:
 *  1. SCENES['margin-climber'] for standalone verification via stick-scene frames.mjs & motion.mjs
 *  2. window.MARGIN_CLIMBER.drawRail(ctx, state) for live scroll-synced climbing along the portfolio margin
 */
(function () {
  const R = window.RIG;
  if (!R) return;

  const { P, mix, breathe, fig, frontArm, wline, circle, inkFill, sparks, E, seg, clamp, lerp, pulse } = R;

  // Local rope offset in front of the figure (figure faces right toward the rope)
  const ROPE_LOCAL_X = 22;

  // Base perched idle pose on the rope (hands clear of head, natural bent elbows & knees)
  const PERCH_IDLE = P({
    head: [5, -115],
    chest: [1, -90],
    hip: [-3, -59],
    hF: [ROPE_LOCAL_X, -112],
    hB: [ROPE_LOCAL_X, -79],
    fF: [17, -18],
    fB: [15, -5],
    kF: [28, -38],
    kB: [24, -32],
    ef: 0.9,
    eb: 0.95,
    hang: 0,
  });

  // Standing ready at the bottom knot shelf, waving cheerfully
  const LANDED_POSE = P({
    head: [3, -116],
    chest: [0, -90],
    hip: [-1, -59],
    hF: [14, -124],
    hB: [ROPE_LOCAL_X, -94],
    fF: [8, -2.5],
    fB: [-6, -2.5],
    kF: [22, -32],
    kB: [12, -32],
    ef: 0.95,
    eb: 0.85,
    hang: 0,
  });

  /**
   * Computes a smooth, continuous contralateral climbing pose at phase `ph` (cycles)
   * with `activity` (0 = perched idle, 1 = actively climbing) and `dir` (+1 descending, -1 ascending).
   */
  function climbPose(ph, activity, dir, t) {
    const a = ph * Math.PI * 2;
    // Direction reverses phase smoothly so hands pull down when climbing up, and lower when descending
    const d = dir >= 0 ? 1 : -1;
    const sF = Math.sin(a * d);
    const cF = Math.cos(a * d);
    const sB = Math.sin(a * d + Math.PI);
    const cB = Math.cos(a * d + Math.PI);

    // Hands: grip rope tightly on half-cycle, lift slightly off rope (~6u) while reaching to next hold
    const reachF = Math.max(0, cF) * 6;
    const reachB = Math.max(0, cB) * 6;
    const hFy = -98 - sF * 22;
    const hBy = -98 - sB * 22;

    // Contralateral legs: when front hand is high (sF > 0), back foot steps higher
    const stepF = Math.max(0, -cF) * 6;
    const stepB = Math.max(0, -cB) * 6;
    const fFy = -14 + sF * 11;
    const fBy = -14 + sB * 11;

    // Subtle body bob and directional lean (slight lean back on descent, closer on ascent)
    const bob = Math.sin(a * 2) * 1.6;
    const leanX = d > 0 ? -2.2 : 1.4;
    const headLookY = d > 0 ? 2.4 : -2.2;

    const activePose = P({
      head: [5 + leanX * 0.5, -114 + bob + headLookY],
      chest: [1 + leanX * 0.6, -90 + bob],
      hip: [-3 + leanX, -59 + bob * 0.7],
      hF: [ROPE_LOCAL_X - reachF, hFy],
      hB: [ROPE_LOCAL_X - reachB, hBy],
      fF: [16 - stepF, fFy],
      fB: [15 - stepB, fBy],
      kF: [28, -36 + sF * 4],
      kB: [25, -36 + sB * 4],
      ef: 0.9,
      eb: 0.9,
      hang: 0,
    });

    let pose = mix(PERCH_IDLE, activePose, clamp(activity, 0, 1));
    // Gentle idle glance when resting
    const glance = pulse(t, 6.4, 2.0, 1.4) * (1 - clamp(activity, 0, 1));
    if (glance > 0.01) {
      pose = P(
        {
          head: [pose.head[0] - glance * 3.5, pose.head[1] + glance * 1.2],
        },
        pose,
      );
    }
    return breathe(pose, t, 0.85 * (1 - clamp(activity, 0, 1) * 0.5));
  }

  /**
   * Draws a hand-drawn rope with anchor knots and a climber using RIG.fig() + RIG.frontArm().
   */
  function drawClimberOnRope(g, opts) {
    const {
      x,
      y,
      scale,
      ropeTop,
      ropeBottom,
      progress,
      pose,
      ink,
      far,
      pen,
      ropeCol,
      knots,
      waveAmt,
      waveTime,
      sparkK,
    } = opts;

    const ropeWorldX = x + ROPE_LOCAL_X * scale;

    // 1. Background full rope line (hand-drawn wobbly polyline)
    wline(g, [[ropeWorldX, ropeTop], [ropeWorldX, ropeBottom]], 1.8, ropeCol, 0.9, 11);

    // 2. Progress pen-inked portion of the rope already descended
    const climbedY = lerp(ropeTop, ropeBottom, clamp(progress, 0, 1));
    if (climbedY > ropeTop + 2) {
      wline(g, [[ropeWorldX, ropeTop], [ropeWorldX, climbedY]], 2.1, pen, 0.75, 17);
    }

    // 3. Top anchor piton/carabiner ring
    circle(g, ropeWorldX, ropeTop, 4.2);
    inkFill(g, 'transparent', 1.7, pen);

    // 4. Section knots along the rope
    if (knots && knots.length) {
      for (let i = 0; i < knots.length; i++) {
        const ky = lerp(ropeTop + 10, ropeBottom - 10, knots[i]);
        const passed = ky <= climbedY + 6;
        circle(g, ropeWorldX, ky, passed ? 3.2 : 2.3);
        inkFill(g, passed ? pen : 'transparent', 1.4, passed ? pen : ropeCol);
      }
    }

    // 5. Bottom landing shelf when near bottom
    wline(
      g,
      [
        [ropeWorldX - 30 * scale, ropeBottom + 2],
        [ropeWorldX + 12 * scale, ropeBottom + 2],
      ],
      1.6,
      ropeCol,
      0.7,
      29,
    );

    // 6. Draw the stick figure (back arm behind rope, torso, legs, head, front arm)
    const J = fig(g, pose, x, y, {
      s: scale,
      sx: 1,
      ink,
      far,
      shadow: false,
      wave: waveAmt || 0,
      wt: waveTime || 0,
    });

    // 7. Re-stroke short rope segment right between the hands BEHIND the near hand,
    //    then redraw near arm on top so the front hand grips in front of the rope.
    const gripTop = Math.min(J.w.handF[1], J.w.handB[1]) - 4 * scale;
    const gripBot = Math.min(climbedY, Math.max(J.w.handF[1], J.w.handB[1]) + 4 * scale);
    if (gripBot > gripTop + 2) {
      wline(
        g,
        [
          [ropeWorldX, clamp(gripTop, ropeTop, ropeBottom)],
          [ropeWorldX, clamp(gripBot, ropeTop, ropeBottom)],
        ],
        2.1,
        pen,
        0.45,
        17,
      );
    }
    frontArm(g, J);

    // 8. Optional celebration sparks at bottom or on click-wave
    if (sparkK > 0.02) {
      sparks(g, J.w.head[0] - 12 * scale, J.w.head[1] - 12 * scale, sparkK, 14 * scale, 5, pen);
    }

    return J;
  }

  // Register standalone scene for frames.mjs + motion.mjs verification
  const SC = (window.SCENES = window.SCENES || {});
  SC['margin-climber'] = {
    dur: 6,
    width: 180,
    label: 'Figura desenhada à mão descendo e escalando a corda da margem conforme a rolagem da página.',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : 0;
      const climbDown = E.soft(seg(T, 0.3, 3.2));
      const climbUp = E.soft(seg(T, 3.8, 5.6));
      const prog = S.on ? clamp(0.15 + climbDown * 0.7 - climbUp * 0.7, 0.15, 0.85) : 0.15;
      const dir = T < 3.5 ? 1 : -1;
      const act = S.on
        ? Math.max(
            seg(T, 0.2, 0.5) * (1 - seg(T, 3.0, 3.35)),
            seg(T, 3.65, 4.0) * (1 - seg(T, 5.4, 5.85)),
          )
        : 0;
      const ph = S.on ? climbDown * 2.2 - climbUp * 2.2 : 0;
      const y = lerp(-56, -4, prog);
      const pose = climbPose(ph, act, dir, S.t);

      drawClimberOnRope(g, {
        x: -12,
        y,
        scale: 0.72,
        ropeTop: -176,
        ropeBottom: -4,
        progress: prog,
        pose,
        ink: '#1F1E1C',
        far: '#756F66',
        pen: '#A93F21',
        ropeCol: 'rgba(31,30,28,0.28)',
        knots: [0.15, 0.4, 0.65, 0.88],
        waveAmt: S.wave,
        waveTime: S.wt,
        sparkK: 0,
      });
    },
  };

  // Expose live scroll-rail helper for React host component
  window.MARGIN_CLIMBER = {
    PERCH_IDLE,
    LANDED_POSE,
    climbPose,
    drawClimberOnRope,
    mix,
    breathe,
    E,
    clamp,
    lerp,
  };
})();
