export enum OpCode {
  STANDARD_QUERY = 0,
}

export enum ResponseCode {
  NO_ERROR = 0,
  FORMAT_ERROR = 1,
  SERVER_ERROR = 2,
  NAME_ERROR = 3,
}

export interface TDNSHeader {
  id: number;
  qr: number;
  opcode: OpCode;
  aa: number;
  tc: number;
  rd: number;
  ra: number;
  z: number;
  rcode: ResponseCode;
  qdcount: number;
  ancount: number;
  nscount: number;
  arcount: number;
}

class DNSHeader {
  static write(values: TDNSHeader) {
    const header = Buffer.alloc(12);
    const {
      aa,
      ancount,
      arcount,
      id,
      nscount,
      opcode,
      qdcount,
      qr,
      ra,
      rcode,
      rd,
      tc,
      z,
    } = values;
    header.writeInt16BE(id, 0);
    const flags = qr | opcode | aa | tc | rd | ra | z | rcode;

    header.writeInt16BE(id, 0);
    header.writeInt16BE(flags, 2);
    header.writeInt16BE(qdcount, 4);
    header.writeInt16BE(ancount, 6);
    header.writeInt16BE(nscount, 8);
    header.writeInt16BE(arcount, 10);

    return header;
  }
}

export default DNSHeader;
