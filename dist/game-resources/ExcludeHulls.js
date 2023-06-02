function applyExcludeHulls(shader) {
  let v = shader.vertexShader;
  let f = shader.fragmentShader;
  let info, before, content;
  for (let i in data.vertex) {
    info = data.vertex[i];
    ({ before, content } = info);
    if (info.append) content = before + content;
    v = v.replace(before, content);
  }
  for (let i in data.fragment) {
    info = data.fragment[i];
    ({ before, content } = info);
    if (info.append) content = before + content;
    f = f.replace(before, content);
  }
  shader.vertexShader = v;
  shader.fragmentShader = f;
  return shader;
}

var data = {
  vertex: [
    {
      before: "#include <begin_vertex>",
      content: "\n    pos = (mat4(modelMatrix) * vec4(position,1.0)).xyz;",
      append: true
    },
    {
      before: "<common>",
      content: "\nvarying vec3 pos;",
      append: true
    }
  ],
  fragment: [
    {
      before: "<common>",
      content: "\nuniform vec4 excludeHulls[/*<hullNumber>*/1/*</hullNumber>*/];",
      append: true
    },
    // {
    //   before: "<common>",
    //   content: "mat3 EulerToMat4(vec4 euler){\n  float x = euler.x;\n  float y = euler.y;\n  float z = euler.z;\n  float a = cos( x );\n  float b = sin( x );\n  float c = cos( y );\n  float d = sin( y );\n  float e = cos( z );\n  float f = sin( z );\n  float ae = a * e;\n  float af = a * f;\n  float be = b * e;\n  float bf = b * f;\n\n  mat3 mat = mat3(1.0);\n\n  mat[0][0] = c * e;\n  mat[1][0] = -c * f;\n  mat[2][0] = d;\n\n  mat[0][1] = af + be * d;\n  mat[1][1] = ae - bf * d;\n  mat[2][1] = - b * c;\n\n  mat[0][2] = bf - ae * d;\n  mat[1][2] = be + af * d;\n  mat[2][2] = a * c;\n\n  return mat;\n}",
    //   append: true
    // },
    {
      before: "<common>",
      content: "mat3 EulerToMat4(vec4 euler){\n  float x = euler.x;\n  float y = euler.y;\n  float z = euler.z;\n  float a = cos( x );\n  float b = sin( x );\n  float c = cos( y );\n  float d = sin( y );\n  float e = cos( z );\n  float f = sin( z );\n  float ae = a * e;\n  float af = a * f;\n  float be = b * e;\n  float bf = b * f;\n\n  mat3 mat = mat3(1.0);\n\n  mat[0][0] = c * e;\n  mat[0][1] = a * f + e * b * d;\n  mat[0][2] = b * f - d * a * e;\n\n  mat[1][0] = -f * c;\n  mat[1][1] = a * e - b * f * d;\n  mat[1][2] = e * b + a * d * f;\n\n  mat[2][0] = d;\n  mat[2][1] = -c * b;\n  mat[2][2] = a * c;\n\n  return mat;\n}",
      append: true
    },
    // {
    //   before: "<common>",
    //   content: "mat3 EulerToMat4(vec4 euler){\n  float heading = euler.y;\n  float attitude = -euler.z;\n  float bank = euler.x;\n   float ch = cos(heading);\n    float sh = sin(heading);\n    float ca = cos(attitude);\n    float sa = sin(attitude);\n    float cb = cos(bank);\n    float sb = sin(bank);\n\n  float m00 = ch * ca;\n   float m01 = sh*sb - ch*sa*cb;\n   float m02 = ch*sa*sb + sh*cb;\n   float m10 = sa;\n   float m11 = ca*cb;\n   float m12 = -ca*sb;\n   float m20 = -sh*ca;\n   float m21 = sh*sa*cb + ch*sb;\n   float m22 = -sh*sa*sb + ch*cb;\n    mat3 m = mat3(1.0);\n   m[0][0] = m00;\n    m[0][1] = m01;\n    m[0][2] = m02;\n    m[1][0] = m10;\n    m[1][1] = m11;\n    m[1][2] = m12;\n    m[2][0] = m20;\n    m[2][1] = m21;\n    m[2][2] = m22;return m;}",
    //   append: true
    // },
    {
      before: "<common>",
      content: "\n varying vec3 pos;\nfloat insideBox3D(vec4 p, vec3 bottomLeft, vec3 topRight,mat3 rotation) {\n\tvec3 center = (topRight+bottomLeft)/2.0;\n\tvec3 v = center + inverse(rotation)*(center-vec3(p));\n\tvec3 s = step(bottomLeft, v) - step(topRight, v);\n\treturn abs(s.x) * abs(s.y) * abs(s.z);\n}\n\nfloat insideSphere(vec3 point, vec4 info){\n\tvec3 sphere = vec3(info.xyz);\n\tfloat radius = info.w;return ((point.x - sphere.x) * (point.x - sphere.x) +(point.y - sphere.y) * (point.y - sphere.y) +(point.z - sphere.z) * (point.z - sphere.z))/(radius*radius);\n}",
      append: true
    },
    {
      before: ">\n}",
      content: ">\n" + "for(int i = 0; i < /*<hullNumber>*/1/*</hullNumber>*/;i++)\n{\n\tvec4 vector = excludeHulls[i];\n\tif(vector.w == 0.){\n\t\tgl_FragColor.w-=insideBox3D(vec4(pos,1.0),vec3(vector),vec3(excludeHulls[i+1]),EulerToMat4(excludeHulls[i+2]));\n\t\ti+=2;}\n\telse\n\t{\n\t\tgl_FragColor.w-= 1.0-pow(insideSphere(pos,vector),100.0);\n\t}\n}" + "\n}"
    }
  ]
};

export { applyExcludeHulls };