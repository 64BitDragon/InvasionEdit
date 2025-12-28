// decodeFLMvideo TypeScript port
// - height, width in pixels (must be multiples of 4 for this routine; function uses >>2)
// - outBuffer: Uint32Array large enough to hold height*width pixels (row-major)
// - flmData: Uint8Array containing the encoded FLM stream starting at offset 0
// - lookupTable: Uint8Array view of DAT_00486d90
//
// Returns: number of bytes consumed from flmData (aligned down to multiple of 8)
export function decodeSTRFile(
    strData: Uint8Array,
    offset: number = 0
): string[] {

    const strings: string[] = [];
    let currentOffset = offset;

    while (currentOffset < strData.length) {
        const length = strData[currentOffset];
        if (length === 0) break;
        currentOffset++;

        const str = new TextDecoder().decode(strData.slice(currentOffset, currentOffset + length));
        strings.push(str);
        currentOffset += length;
    }

    return strings;
}

export function parseStrFile(buffer: ArrayBuffer): StrFileData {
  const reader = new BinaryReader(new DataView(buffer));

  // ---- Header ----
  reader.skip(0x04); // fileExtension
  reader.skip(4);    // fileSize
  reader.skip(8);    // unknown
  reader.skip(8 * 3); // Date1 x3 (7 bytes each)
  reader.skip(8);    // empty
  reader.skip(0x40); // pcname1
  reader.skip(0x40); // pcname2

  const languageCount = reader.u32();

  reader.skip(0x4c);
  reader.skip(0x100); // path

  // ---- Languages ----
  const languages: StrLanguage[] = [];
  for (let i = 0; i < languageCount; i++) {
    languages.push(parseLanguage(reader));
  }

  const stringCount = languages[0]?.strings.length ?? 0;

  return { languages, stringCount };
}
function parseLanguage(reader: BinaryReader): StrLanguage {
    const languageStartOffset = reader.offset;
  const totalSizeOfLanguage = reader.u32();
  const indexCount = reader.u32();
  const languageId = reader.u32();
  reader.u32(); // d (unused)

  const offsets: { start: number; end: number; length: number }[] = [];

  // indexCount - 1 offsets
  let start = reader.u32();
  let end = reader.u32();
  for (let i = 0; i < indexCount - 1; i++) {
    offsets.push({
      start,
      end,
      length: (end - start) / 2
    });
    start = end;
    end = reader.u32();
  }

  const lastIndexOffset = start;
  const lastLength = (totalSizeOfLanguage - lastIndexOffset) / 2;

  const strings: string[] = [];

  // Read indexed strings
  reader.offset = languageStartOffset + offsets[0].start;
  for (let i = 0; i < offsets.length; i++) {
    strings.push(reader.readUtf16Chars(offsets[i].length));
  }

  // Last string
  strings.push(reader.readUtf16Chars(lastLength));

  return { languageId, strings };
}
class BinaryReader {
  constructor(
    private view: DataView,
    public offset = 0
  ) {}

  u8()  { return this.view.getUint8(this.offset++); }
  u16() { const v = this.view.getUint16(this.offset, true); this.offset += 2; return v; }
  u32() { const v = this.view.getUint32(this.offset, true); this.offset += 4; return v; }

  skip(bytes: number) {
    this.offset += bytes;
  }

  readUtf16Chars(count: number): string {
    let result = "";
    for (let i = 0; i < count; i++) {
      const code = this.u16();
      if (code === 0x0000) continue;

      // IMHex comment: newline encoded as 0x8012
      if(code === 0x8012) {
        result += "\n";
      }
      else if (code > 0xff) {
        result += "\"0x" + code.toString(16) + "\"";
      } else {
        result += String.fromCharCode(code);
      }
    }
    return result;
  }
}
export type StrTableRow = {
  index: number;
  values: string[]; // one entry per language
};
export interface StrLanguage {
  languageId: number;        // raw value from IndexInfo.language
  strings: string[];         // index-aligned
}

export interface StrFileData {
  languages: StrLanguage[];
  stringCount: number;
}
export function buildStringTable(data: StrFileData): StrTableRow[] {
  const rows: StrTableRow[] = [];

  for (let i = 0; i < data.stringCount; i++) {
    rows.push({
      index: i,
      values: data.languages.map(lang => lang.strings[i] ?? "")
    });
  }

  return rows;
}


