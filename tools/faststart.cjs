// Lossless fast-start relocation for this portfolio's non-fragmented MP4 files.
// Refuses other layouts. Run with: node tools/faststart.cjs
const fs = require('node:fs');
const crypto = require('node:crypto');
const path = require('node:path');
function atoms(buffer, start = 0, end = buffer.length) {
    const result = [];
    for (let offset = start; offset < end;) {
        if (offset + 8 > end) throw Error('Truncated atom');
        const size = buffer.readUInt32BE(offset);
        if (size < 8 || offset + size > end) throw Error('Unsupported atom size');
        result.push({ type: buffer.toString('ascii', offset + 4, offset + 8), offset, size });
        offset += size;
    }
    return result;
}
const hash = buffer => crypto.createHash('sha256').update(buffer).digest('hex');
for (const directory of ['Tatamiam', 'IsekaiWar', 'Entrecote', 'SpaceRunner']) {
    const file = path.join(__dirname, '..', directory, 'Gameplay.mp4');
    const original = fs.readFileSync(file);
    const top = atoms(original);
    const moov = top.find(atom => atom.type === 'moov');
    const mdat = top.find(atom => atom.type === 'mdat');
    if (!moov || !mdat || top.filter(atom => atom.type === 'moov' || atom.type === 'mdat').length !== 2 || top.some(atom => !['ftyp', 'free', 'mdat', 'moov'].includes(atom.type))) throw Error('Unsupported MP4 layout');
    if (moov.offset < mdat.offset) { console.log(directory + ': already fast-start'); continue; }
    if (moov.offset + moov.size !== original.length) throw Error('Expected trailing moov');
    const metadata = Buffer.from(original.subarray(moov.offset));
    let chunks = 0;
    function patch(start, end) {
        for (const atom of atoms(metadata, start, end)) {
            if (['moov', 'trak', 'mdia', 'minf', 'stbl'].includes(atom.type)) patch(atom.offset + 8, atom.offset + atom.size);
            if (atom.type === 'stco' || atom.type === 'co64') {
                const count = metadata.readUInt32BE(atom.offset + 12);
                const bytes = atom.type === 'stco' ? 4 : 8;
                if (16 + count * bytes !== atom.size) throw Error('Invalid offset table');
                for (let i = 0; i < count; i++) {
                    const at = atom.offset + 16 + i * bytes;
                    const old = bytes === 4 ? metadata.readUInt32BE(at) : Number(metadata.readBigUInt64BE(at));
                    if (old < mdat.offset + 8 || old >= mdat.offset + mdat.size) throw Error('Chunk outside media data');
                    const updated = old + moov.size;
                    if (bytes === 4) metadata.writeUInt32BE(updated, at);
                    else metadata.writeBigUInt64BE(BigInt(updated), at);
                    chunks++;
                }
            }
        }
    }
    patch(0, metadata.length);
    if (!chunks) throw Error('Missing chunk table');
    const result = Buffer.concat([original.subarray(0, mdat.offset), metadata, original.subarray(mdat.offset, moov.offset)]);
    const media = atoms(result).find(atom => atom.type === 'mdat');
    const originalHash = hash(original.subarray(mdat.offset + 8, mdat.offset + mdat.size));
    if (result.length !== original.length || hash(result.subarray(media.offset + 8, media.offset + media.size)) !== originalHash) throw Error('Media integrity mismatch');
    const temporary = file + '.faststart.tmp';
    fs.writeFileSync(temporary, result);
    if (hash(fs.readFileSync(temporary)) !== hash(result)) throw Error('Write verification failed');
    fs.copyFileSync(temporary, file);
    if (hash(fs.readFileSync(file)) !== hash(result)) throw Error('Final verification failed; temporary retained');
    fs.unlinkSync(temporary);
    console.log(`${directory}: relocated ${chunks} chunks; media SHA-256 unchanged (${originalHash})`);
}
