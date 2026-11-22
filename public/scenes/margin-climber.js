/* Central Arrow-Rope Climber — uses window.RIG from /scenes/stick.js.
 * Renders the curly-loop red arrow (Attachment 3) descending down the CENTER of the portfolio
 * as a climbing rope while the stickman climbs down/up along it synced to scrollY.
 */
(function () {
  const R = window.RIG;
  if (!R) return;

  const { P, mix, breathe, fig, frontArm, wline, circle, inkFill, sparks, arrowHead, E, seg, clamp, lerp, pulse } = R;

  // Local rope offset in front of the figure (figure faces right toward the central arrow-rope)
  const ROPE_LOCAL_X = 22;

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

  function climbPose(ph, activity, dir, t) {
    const a = ph * Math.PI * 2;
    const d = dir >= 0 ? 1 : -1;
    const sF = Math.sin(a * d);
    const cF = Math.cos(a * d);
    const sB = Math.sin(a * d + Math.PI);
    const cB = Math.cos(a * d + Math.PI);

    const reachF = Math.max(0, cF) * 6;
    const reachB = Math.max(0, cB) * 6;
    const hFy = -98 - sF * 22;
    const hBy = -98 - sB * 22;

    const stepF = Math.max(0, -cF) * 6;
    const stepB = Math.max(0, -cB) * 6;
    const fFy = -14 + sF * 11;
    const fBy = -14 + sB * 11;

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
   * Draws the signature curly-loop top (matching Attachment 3) feeding into the vertical rope at (rx, topY).
   */
  function drawCurlyLoopTop(g, rx, topY, pen) {
    g.save();
    g.strokeStyle = pen;
    g.lineWidth = 2.1;
    g.lineCap = 'round';
    g.lineJoin = 'round';
    g.beginPath();
    // Enters from top-right, curls through a neat loop-de-loop, and drops straight into (rx, topY)
    g.moveTo(rx + 22, topY - 22);
    g.bezierCurveTo(rx + 8, topY - 8, rx - 14, topY - 10, rx - 12, topY - 22);
    g.bezierCurveTo(rx - 10, topY - 34, rx + 8, topY - 32, rx + 4, topY - 14);
    g.bezierCurveTo(rx + 2, topY - 6, rx, topY - 3, rx, topY);
    g.stroke();
    g.restore();
  }

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

    // 1. Subtle unclimbed guide track down the center
    wline(g, [[ropeWorldX, ropeTop], [ropeWorldX, ropeBottom]], 1.4, ropeCol, 0.7, 11);

    // 2. Signature Attachment-3 curly loop at the top of the arrow-rope
    drawCurlyLoopTop(g, ropeWorldX, ropeTop, pen);

    // 3. Active red/terracotta arrow shaft descending down the center with the climber
    //    Ensure the arrow tip always extends at least slightly below the climber's feet
    const minArrowTip = Math.min(ropeBottom, y + 14 * scale);
    const climbedY = Math.max(minArrowTip, lerp(ropeTop + 28, ropeBottom, clamp(progress, 0, 1)));
    wline(g, [[ropeWorldX, ropeTop], [ropeWorldX, climbedY]], 2.15, pen, 0.7, 17);

    // 4. Open hand-drawn arrowhead at the leading bottom tip of the descending arrow-rope
    arrowHead(g, [ropeWorldX, climbedY + 3], Math.PI / 2, 8.5, 2.1, pen);

    // 5. Section knots along the central arrow-rope
    if (knots && knots.length) {
      for (let i = 0; i < knots.length; i++) {
        const ky = lerp(ropeTop + 14, ropeBottom - 14, knots[i]);
        const passed = ky <= climbedY + 4;
        circle(g, ropeWorldX, ky, passed ? 3.0 : 2.1);
        inkFill(g, passed ? pen : 'transparent', 1.4, passed ? pen : ropeCol);
      }
    }

    // 6. Stick figure climbing the central arrow-rope
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
    //    then redraw near arm on top so the front hand grips in front of the arrow-rope.
    const gripTop = Math.min(J.w.handF[1], J.w.handB[1]) - 4 * scale;
    const gripBot = Math.min(climbedY, Math.max(J.w.handF[1], J.w.handB[1]) + 4 * scale);
    if (gripBot > gripTop + 2) {
      wline(
        g,
        [
          [ropeWorldX, clamp(gripTop, ropeTop, ropeBottom)],
          [ropeWorldX, clamp(gripBot, ropeTop, ropeBottom)],
        ],
        2.15,
        pen,
        0.4,
        17,
      );
    }
    frontArm(g, J);

    if (sparkK > 0.02) {
      sparks(g, J.w.head[0] - 12 * scale, J.w.head[1] - 12 * scale, sparkK, 14 * scale, 5, pen);
    }

    return J;
  }

  const SC = (window.SCENES = window.SCENES || {});
  SC['margin-climber'] = {
    dur: 6,
    width: 180,
    label: 'Seta vermelha com laço desce pelo centro do portfólio servindo de corda para o stickman descer escalando.',
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
        ropeTop: -156,
        ropeBottom: -12,
        progress: prog,
        pose,
        ink: '#1F1E1C',
        far: '#756F66',
        pen: '#A93F21',
        ropeCol: 'rgba(31,30,28,0.22)',
        knots: [0.15, 0.4, 0.65, 0.88],
        waveAmt: S.wave,
        waveTime: S.wt,
        sparkK: 0,
      });
    },
  };

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
