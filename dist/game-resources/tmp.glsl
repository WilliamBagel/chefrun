mat4 EulerToMat4(vec4 euler){
  float x = euler.x;
  float y = euler.y;
  float z = euler.z;
  float a = cos( x );
  float b = sin( x );
  float c = cos( y );
  float d = sin( y );
  float e = cos( z );
  float f = sin( z );
  float ae = a * e;
  float af = a * f;
  float be = b * e;
  float bf = b * f;

  mat4 mat = mat4()

  mat[ 0 ] = c * e;
  mat[ 4 ] = -c * f;
  mat[ 8 ] = d;

  mat[ 1 ] = af + be * d;
  mat[ 5 ] = ae - bf * d;
  mat[ 9 ] = - b * c;

  mat[ 2 ] = bf - ae * d;
  mat[ 6 ] = be + af * d;
  mat[ 10 ] = a * c;

  return mat;
}

