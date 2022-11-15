import { M_PId180f } from '../constants';

export function RAD_TO_DEG(rad: number) {
  return (rad * 180.0) / Math.PI;
}

export function vec3_length(v: number[]) {
  return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
}

export function vec3_normalize(v: number[]) {
  let len, invLen;

  len = vec3_length(v);
  if (len === 0.0) {
    return;
  }
  invLen = 1.0 / len;

  v[0] *= invLen;
  v[1] *= invLen;
  v[2] *= invLen;

  return len;
}

export function matrix_turn_x(m: number[], cosA: number, sinA: number) {
  let m01, m02;
  let m11, m12;
  let m21, m22;
  let m31, m32;
  let mx01, mx02;
  let mx11, mx12;
  let mx21, mx22;
  let mx31, mx32;

  m01 = m[4]; //m->m01;
  m02 = m[8]; //m->m02;
  m11 = m[5]; //m->m11;
  m12 = m[9]; //m->m12;
  m21 = m[6]; //m->m21;
  m22 = m[10]; //m->m22;
  m31 = m[7]; //m->m31;
  m32 = m[11]; //m->m32;

  mx01 = cosA * m01;
  mx02 = sinA * m01;

  mx11 = cosA * m11;
  mx12 = sinA * m11;

  mx21 = cosA * m21;
  mx22 = sinA * m21;

  mx31 = cosA * m31;
  mx32 = sinA * m31;

  mx01 = sinA * m02 + mx01;
  mx02 = cosA * m02 - mx02;

  mx11 = sinA * m12 + mx11;
  mx12 = cosA * m12 - mx12;

  mx21 = sinA * m22 + mx21;
  mx22 = cosA * m22 - mx22;

  mx31 = sinA * m32 + mx31;
  mx32 = cosA * m32 - mx32;

  m[4] = mx01;
  m[8] = mx02;

  m[5] = mx11;
  m[9] = mx12;

  m[6] = mx21;
  m[10] = mx22;

  m[7] = mx31;
  m[11] = mx32;
}

/*
 * void turn_y(float *m, float cosA, float cosB)
 * local rotation around Y-axis
 * M = M * Ry
 *
 * | m00 m01 m02 m03 |   | m00 m01 m02 m03 |   |  cosA 0 sinA 0 |
 * | m10 m11 m12 m13 | = | m10 m11 m12 m13 | * |   0   1   0  0 |
 * | m20 m21 m22 m23 |   | m20 m21 m22 m23 |   | -sinA 0 cosA 0 |
 * | m30 m31 m32 m33 |   | m30 m31 m32 m33 |   |   0     0  0 1 |
 */

export function matrix_turn_y(m: number[], cosA: number, sinA: number) {
  let m00, m02;
  let m10, m12;
  let m20, m22;
  let m30, m32;
  let mx00, mx02;
  let mx10, mx12;
  let mx20, mx22;
  let mx30, mx32;

  m00 = m[0]; //m->m00;
  m02 = m[8]; //m->m02;
  m10 = m[1]; //m->m10;
  m12 = m[9]; //m->m12;
  m20 = m[2]; //m->m20;
  m22 = m[10]; //m->m22;
  m30 = m[3]; //m->m30;
  m32 = m[11]; //m->m32;

  mx00 = cosA * m00;
  mx02 = sinA * m00;

  mx10 = cosA * m10;
  mx12 = sinA * m10;

  mx20 = cosA * m20;
  mx22 = sinA * m20;

  mx30 = cosA * m30;
  mx32 = sinA * m30;

  mx00 = -sinA * m02 + mx00;
  mx02 = cosA * m02 + mx02;

  mx10 = -sinA * m12 + mx10;
  mx12 = cosA * m12 + mx12;

  mx20 = -sinA * m22 + mx20;
  mx22 = cosA * m22 + mx22;

  mx30 = -sinA * m32 + mx30;
  mx32 = cosA * m32 + mx32;

  m[0] = mx00;
  m[8] = mx02;

  m[1] = mx10;
  m[9] = mx12;

  m[2] = mx20;
  m[10] = mx22;

  m[3] = mx30;
  m[11] = mx32;
}

/*
 * void turn_z(float *m, float cosA, float sinA)
 * local rotation around Z-axis
 * M = M * Rz
 *
 * | m00 m01 m02 m03 |   | m00 m01 m02 m03 |   | cosA -sinA 0 0 |
 * | m10 m11 m12 m13 | = | m10 m11 m12 m13 | * | sinA  cosA 0 0 |
 * | m20 m21 m22 m23 |   | m20 m21 m22 m23 |   |   0     0  1 0 |
 * | m30 m31 m32 m33 |   | m30 m31 m32 m33 |   |   0     0  0 1 |
 *
 */

export function matrix_turn_z(m: number[], cosA: number, sinA: number) {
  let m00, m01;
  let m10, m11;
  let m20, m21;
  let m30, m31;
  let mx00, mx01;
  let mx10, mx11;
  let mx20, mx21;
  let mx30, mx31;

  m00 = m[0]; //m->m00;
  m01 = m[4]; //m->m01;
  m10 = m[1]; //m->m10;
  m11 = m[5]; //m->m11;
  m20 = m[2]; //m->m20;
  m21 = m[6]; //m->m21;
  m30 = m[3]; //m->m30;
  m31 = m[7]; //m->m31;

  mx00 = cosA * m00;
  mx01 = sinA * m00;

  mx10 = cosA * m10;
  mx11 = sinA * m10;

  mx20 = cosA * m20;
  mx21 = sinA * m20;

  mx30 = cosA * m30;
  mx31 = sinA * m30;

  mx00 = sinA * m01 + mx00;
  mx01 = cosA * m01 - mx01;

  mx10 = sinA * m11 + mx10;
  mx11 = cosA * m11 - mx11;

  mx20 = sinA * m21 + mx20;
  mx21 = cosA * m21 - mx21;

  mx30 = sinA * m31 + mx30;
  mx31 = cosA * m31 - mx31;

  m[0] = mx00;
  m[4] = mx01;
  m[1] = mx10;
  m[5] = mx11;
  m[2] = mx20;
  m[6] = mx21;
  m[3] = mx30;
  m[7] = mx31;
}

/************************************************************
   Translate Matrix
   M = M * T
  
    | m00  m04  m08  m12 |   | 1  0  0  x |   | m00  m04  m08  (m00*x + m04*y + m08*z + m12) |
    | m01  m05  m09  m13 | * | 0  1  0  y | = | m01  m05  m09  (m01*x + m05*y + m09*z + m13) |
    | m02  m06  m10  m14 |   | 0  0  1  z |   | m02  m06  m10  (m02*x + m06*y + m10*z + m14) |
    | m03  m07  m11  m15 |   | 0  0  0  1 |   | m03  m07  m11  (m03*x + m07*y + m11*z + m15) |
***********************************************************/
export function matrix_translate(m: number[], x: number, y: number, z: number) {
  let m00, m01, m02, m03;
  let m04, m05, m06, m07;
  let m08, m09, m10, m11;
  let m12, m13, m14, m15;

  m00 = m[0];
  m04 = m[4];
  m08 = m[8]; /* m12 = m[12]; */
  m01 = m[1];
  m05 = m[5];
  m09 = m[9]; /* m13 = m[13]; */
  m02 = m[2];
  m06 = m[6];
  m10 = m[10]; /* m14 = m[14]; */
  m03 = m[3];
  m07 = m[7];
  m11 = m[11]; /* m15 = m[15]; */

  m12 = m[12];
  m13 = m[13];
  m14 = m[14];
  m15 = m[15];

  m12 += m08 * z;
  m13 += m09 * z;
  m14 += m10 * z;
  m15 += m11 * z;

  m12 += m04 * y;
  m13 += m05 * y;
  m14 += m06 * y;
  m15 += m07 * y;

  m12 += m00 * x;
  m13 += m01 * x;
  m14 += m02 * x;
  m15 += m03 * x;

  m[12] = m12;
  m[13] = m13;
  m[14] = m14;
  m[15] = m15;
}

/************************************************************
  Rotate Matrix
    | m00  m04  m08  m12 |   | r00  r04  r08   0 |
    | m01  m05  m09  m13 | * | r01  r05  r09   0 |
    | m02  m06  m10  m14 |   | r02  r06  r10   0 |
    | m03  m07  m11  m15 |   |   0    0    0   1 |
    
    m00 = m00*r00 + m04*r01 + m08*r02
    m01 = m01*r00 + m05*r01 + m09*r02
    m02 = m02*r00 + m06*r01 + m10*r02
    m03 = m03*r00 + m07*r01 + m11*r02
    
    m04 = m00*r04 + m04*r05 + m08*r06
    m05 = m01*r04 + m05*r05 + m09*r06
    m06 = m02*r04 + m06*r05 + m10*r06
    m07 = m03*r04 + m07*r05 + m11*r06
    
    m08 = m00*r08 + m04*r09 + m08*r10
    m09 = m01*r08 + m05*r09 + m09*r10
    m10 = m02*r08 + m06*r09 + m10*r10
    m11 = m03*r08 + m07*r09 + m11*r10
    
    m12 = m12
    m13 = m13
    m14 = m14
    m15 = m15
***********************************************************/
export function matrix_rotate(m: number[], angle: number, x: number, y: number, z: number) {
  let v = [0, 0, 0],
    angleRadian;
  let sinA, cosA, cosA2;
  let xcosA2, ycosA2, zcosA2;
  let xsinA, ysinA, zsinA;

  angleRadian = angle * M_PId180f;
  sinA = Math.sin(angleRadian);
  cosA = Math.cos(angleRadian);

  /* for fast rotation around X-Axis/Y-Axis,and Z-Axis */
  if (x === 0.0 && y === 0.0 && z !== 0.0) {
    if (z < 0.0) {
      /* If the Axis of the Rotation is minus, Rotate Backwords */
      sinA = -sinA;
    }
    /* Z Axis Rotateion */
    matrix_turn_z(m, cosA, sinA);
    return;
  } else if (x === 0.0 && y !== 0.0 && z === 0.0) {
    if (y < 0.0) {
      /* If the Axis of the Rotation is minus, Rotate Backwords */
      sinA = -sinA;
    }
    /* Y Axis Rotation */
    matrix_turn_y(m, cosA, sinA);
    return;
  } else if (x !== 0.0 && y === 0.0 && z === 0.0) {
    if (x < 0.0) {
      /* If the Axis of the Rotation is minus, Rotate Backwords */
      sinA = -sinA;
    }
    /* X Axis Rotation */
    matrix_turn_x(m, cosA, sinA);
    return;
  }

  {
    let r00, r01, r02;
    let r10, r11, r12;
    let r20, r21, r22;

    /* normalization of 3D-vector */
    v[0] = x;
    v[1] = y;
    v[2] = z;
    vec3_normalize(v);

    x = v[0];
    y = v[1];
    z = v[2];

    /* making rotation matrix */
    cosA2 = 1.0 - cosA;
    xsinA = x * sinA;
    ysinA = y * sinA;
    zsinA = z * sinA;
    xcosA2 = x * cosA2;
    ycosA2 = y * cosA2;
    zcosA2 = z * cosA2;

    r00 = x * xcosA2 + cosA;
    r10 = y * xcosA2 + zsinA;
    r20 = z * xcosA2 - ysinA;

    r01 = x * ycosA2 - zsinA;
    r11 = y * ycosA2 + cosA;
    r21 = z * ycosA2 + xsinA;

    r02 = x * zcosA2 + ysinA;
    r12 = y * zcosA2 - xsinA;
    r22 = z * zcosA2 + cosA;

    /* multing with 3x3 rotating matrix. */
    {
      let fm0, fm1, fm2;
      let mx, my, mz;

      /* load 0th low of "m" */
      fm0 = m[0];
      fm1 = m[4];
      fm2 = m[8]; /* fm3 = m[12]; */

      mx = fm0 * r00;
      my = fm0 * r01;
      mz = fm0 * r02;

      mx += fm1 * r10;
      my += fm1 * r11;
      mz += fm1 * r12;

      mx += fm2 * r20;
      my += fm2 * r21;
      mz += fm2 * r22;

      fm0 = m[1];
      fm1 = m[5];
      fm2 = m[9]; /* fm3 = m[13]; */

      m[0] = mx;
      m[4] = my;
      m[8] = mz;

      /* *************************** */
      mx = fm0 * r00;
      my = fm0 * r01;
      mz = fm0 * r02;

      mx += fm1 * r10;
      my += fm1 * r11;
      mz += fm1 * r12;

      mx += fm2 * r20;
      my += fm2 * r21;
      mz += fm2 * r22;

      fm0 = m[2];
      fm1 = m[6];
      fm2 = m[10]; /* m23 = m[14]; */

      m[1] = mx;
      m[5] = my;
      m[9] = mz;

      /* *************************** */
      mx = fm0 * r00;
      my = fm0 * r01;
      mz = fm0 * r02;

      mx += fm1 * r10;
      my += fm1 * r11;
      mz += fm1 * r12;

      mx += fm2 * r20;
      my += fm2 * r21;
      mz += fm2 * r22;

      fm0 = m[3];
      fm1 = m[7];
      fm2 = m[11]; /* m33 = m[15]; */

      m[2] = mx;
      m[6] = my;
      m[10] = mz;

      /* *************************** */
      mx = fm0 * r00;
      my = fm0 * r01;
      mz = fm0 * r02;

      mx += fm1 * r10;
      my += fm1 * r11;
      mz += fm1 * r12;

      mx += fm2 * r20;
      my += fm2 * r21;
      mz += fm2 * r22;

      m[3] = mx;
      m[7] = my;
      m[11] = mz;
    }
  }
}

/******************************************
   Scale Matrix
    | m00  m04  m08  m12 |   | x  0  0  0 |
    | m01  m05  m09  m13 | * | 0  y  0  0 |
    | m02  m06  m10  m14 |   | 0  0  z  0 |
    | m03  m07  m11  m15 |   | 0  0  0  1 |
*******************************************/
export function matrix_scale(m: number[], x: number, y: number, z: number) {
  let m00, m01, m02, m03;
  let m04, m05, m06, m07;
  let m08, m09, m10, m11;
  /* let m12, m13, m14, m15; */

  m00 = m[0];
  m04 = m[4];
  m08 = m[8]; /* m12 = m[12]; */
  m01 = m[1];
  m05 = m[5];
  m09 = m[9]; /* m13 = m[13]; */
  m02 = m[2];
  m06 = m[6];
  m10 = m[10]; /* m14 = m[14]; */
  m03 = m[3];
  m07 = m[7];
  m11 = m[11]; /* m15 = m[15]; */

  m00 = m00 * x;
  m04 = m04 * y;
  m08 = m08 * z;

  m01 = m01 * x;
  m05 = m05 * y;
  m09 = m09 * z;

  m02 = m02 * x;
  m06 = m06 * y;
  m10 = m10 * z;

  m03 = m03 * x;
  m07 = m07 * y;
  m11 = m11 * z;

  m[0] = m00;
  m[4] = m04;
  m[8] = m08;

  m[1] = m01;
  m[5] = m05;
  m[9] = m09;

  m[2] = m02;
  m[6] = m06;
  m[10] = m10;

  m[3] = m03;
  m[7] = m07;
  m[11] = m11;
}

/******************************************
   Multiply Matrix
     M = M1 * M2
*******************************************/
export function matrix_mult(m: number[], m1: number[], m2: number[]) {
  let fm0, fm1, fm2, fm3;
  let fpm00, fpm01, fpm02, fpm03;
  let fpm10, fpm11, fpm12, fpm13;
  let fpm20, fpm21, fpm22, fpm23;
  let fpm30, fpm31, fpm32, fpm33;
  let x, y, z, w;

  /* load pMb */
  fpm00 = m2[0];
  fpm01 = m2[4];
  fpm02 = m2[8];
  fpm03 = m2[12];

  fpm10 = m2[1];
  fpm11 = m2[5];
  fpm12 = m2[9];
  fpm13 = m2[13];

  fpm20 = m2[2];
  fpm21 = m2[6];
  fpm22 = m2[10];
  fpm23 = m2[14];

  fpm30 = m2[3];
  fpm31 = m2[7];
  fpm32 = m2[11];
  fpm33 = m2[15];

  /*  process 0-line of "m1" */
  fm0 = m1[0];
  fm1 = m1[4];
  fm2 = m1[8];
  fm3 = m1[12];

  x = fm0 * fpm00;
  y = fm0 * fpm01;
  z = fm0 * fpm02;
  w = fm0 * fpm03;

  x += fm1 * fpm10;
  y += fm1 * fpm11;
  z += fm1 * fpm12;
  w += fm1 * fpm13;

  x += fm2 * fpm20;
  y += fm2 * fpm21;
  z += fm2 * fpm22;
  w += fm2 * fpm23;

  x += fm3 * fpm30;
  y += fm3 * fpm31;
  z += fm3 * fpm32;
  w += fm3 * fpm33;

  fm0 = m1[1];
  fm1 = m1[5];
  fm2 = m1[9];
  fm3 = m1[13];

  m[0] = x;
  m[4] = y;
  m[8] = z;
  m[12] = w;

  /* *************************** */
  x = fm0 * fpm00;
  y = fm0 * fpm01;
  z = fm0 * fpm02;
  w = fm0 * fpm03;

  x += fm1 * fpm10;
  y += fm1 * fpm11;
  z += fm1 * fpm12;
  w += fm1 * fpm13;

  x += fm2 * fpm20;
  y += fm2 * fpm21;
  z += fm2 * fpm22;
  w += fm2 * fpm23;

  x += fm3 * fpm30;
  y += fm3 * fpm31;
  z += fm3 * fpm32;
  w += fm3 * fpm33;

  fm0 = m1[2];
  fm1 = m1[6];
  fm2 = m1[10];
  fm3 = m1[14];

  m[1] = x;
  m[5] = y;
  m[9] = z;
  m[13] = w;

  /* *************************** */
  x = fm0 * fpm00;
  y = fm0 * fpm01;
  z = fm0 * fpm02;
  w = fm0 * fpm03;

  x += fm1 * fpm10;
  y += fm1 * fpm11;
  z += fm1 * fpm12;
  w += fm1 * fpm13;

  x += fm2 * fpm20;
  y += fm2 * fpm21;
  z += fm2 * fpm22;
  w += fm2 * fpm23;

  x += fm3 * fpm30;
  y += fm3 * fpm31;
  z += fm3 * fpm32;
  w += fm3 * fpm33;

  fm0 = m1[3];
  fm1 = m1[7];
  fm2 = m1[11];
  fm3 = m1[15];

  m[2] = x;
  m[6] = y;
  m[10] = z;
  m[14] = w;

  /* *************************** */
  x = fm0 * fpm00;
  y = fm0 * fpm01;
  z = fm0 * fpm02;
  w = fm0 * fpm03;

  x += fm1 * fpm10;
  y += fm1 * fpm11;
  z += fm1 * fpm12;
  w += fm1 * fpm13;

  x += fm2 * fpm20;
  y += fm2 * fpm21;
  z += fm2 * fpm22;
  w += fm2 * fpm23;

  x += fm3 * fpm30;
  y += fm3 * fpm31;
  z += fm3 * fpm32;
  w += fm3 * fpm33;

  m[3] = x;
  m[7] = y;
  m[11] = z;
  m[15] = w;
}

export function matrix_identity(m: number[]) {
  m[0] = 1.0;
  m[4] = 0.0;
  m[8] = 0.0;
  m[12] = 0.0;
  m[1] = 0.0;
  m[5] = 1.0;
  m[9] = 0.0;
  m[13] = 0.0;
  m[2] = 0.0;
  m[6] = 0.0;
  m[10] = 1.0;
  m[14] = 0.0;
  m[3] = 0.0;
  m[7] = 0.0;
  m[11] = 0.0;
  m[15] = 1.0;
}
