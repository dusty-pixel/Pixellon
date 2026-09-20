// Bake hand-keyed poses into the GLB; no procedural deformation at runtime.
// Usage: node scripts/author-cat-idle.mjs <original Fripouille GLB>
import fs from 'node:fs';
import { Quaternion, Vector3 } from 'three';
const input = fs.readFileSync(process.argv[2]);
const jsonLength = input.readUInt32LE(12);
const doc = JSON.parse(input.subarray(20, 20 + jsonLength).toString());
const binStart = 20 + jsonLength + 8;
let bin = input.subarray(binStart, binStart + doc.buffers[0].byteLength);
const addAccessor = (values, type, min, max) => {
  bin = Buffer.concat([bin, Buffer.alloc((4 - bin.length % 4) % 4)]);
  const data = Buffer.from(new Float32Array(values).buffer);
  const bufferView = doc.bufferViews.length;
  doc.bufferViews.push({ buffer: 0, byteOffset: bin.length, byteLength: data.length });
  bin = Buffer.concat([bin, data]);
  const accessor = doc.accessors.length;
  doc.accessors.push({ bufferView, componentType: 5126, count: values.length / (type === 'VEC4' ? 4 : 1), type, ...(min ? { min, max } : {}) });
  return accessor;
};
const times = [0, 2.5, 4, 6.5, 8, 10, 12, 15, 18];
const inputAccessor = addAccessor(times, 'SCALAR', [0], [18]);
const animation = { name: 'Quiet observation', samplers: [], channels: [] };
// Small head glances and a slow tail-tip flick, with long resting holds.
for (const [name, axis, degrees] of [
  ['Bone.004_05', [0, 1, 0], [0, 0, -4, -4, 0, 0, 3, 0, 0]],
  ['Bone.003_04', [0, 0, 1], [0, 0, 1.5, 1.5, 0, 0, -1, 0, 0]],
  ['Bone.008_017', [1, 0, 0], [0, 2, 4, 1, -3, -1, 0, 0, 0]],
  ['Bone.009_018', [1, 0, 0], [0, 3, 5, 2, -4, -2, 0, 0, 0]],
]) {
  const node = doc.nodes.findIndex((n) => n.name === name);
  if (node < 0) throw new Error(`Missing bone: ${name}`);
  const rest = new Quaternion().fromArray(doc.nodes[node].rotation || [0, 0, 0, 1]);
  const values = degrees.flatMap((angle) => rest.clone().multiply(new Quaternion().setFromAxisAngle(new Vector3(...axis), angle * Math.PI / 180)).normalize().toArray());
  const output = addAccessor(values, 'VEC4');
  animation.channels.push({ sampler: animation.samplers.length, target: { node, path: 'rotation' } });
  animation.samplers.push({ input: inputAccessor, output, interpolation: 'LINEAR' });
}
doc.animations = [animation];
doc.buffers[0].byteLength = bin.length;
doc.asset.extras.modifications = 'Pixellon: added quiet hand-keyed head and tail idle animation.';
let json = Buffer.from(JSON.stringify(doc));
json = Buffer.concat([json, Buffer.alloc((4 - json.length % 4) % 4, 32)]);
bin = Buffer.concat([bin, Buffer.alloc((4 - bin.length % 4) % 4)]);
const header = Buffer.alloc(20);
header.writeUInt32LE(0x46546c67, 0);
header.writeUInt32LE(2, 4);
header.writeUInt32LE(28 + json.length + bin.length, 8);
header.writeUInt32LE(json.length, 12);
header.writeUInt32LE(0x4e4f534a, 16);
const chunk = Buffer.alloc(8);
chunk.writeUInt32LE(bin.length, 0);
chunk.writeUInt32LE(0x004e4942, 4);
fs.writeFileSync('public/models/cat/companion.glb', Buffer.concat([header, json, chunk, bin]));
console.log('Baked quiet idle into companion.glb');
