import * as dgram from "dgram";
import DNSHeader, { OpCode, ResponseCode, TDNSHeader } from "./dns/header";
import DNSQuestion, {
  DNSClass,
  DNSQuestionType,
  IDNSQuestion,
} from "./dns/question";
import DNSAnswer, { IDNSAnswer } from "./dns/answer";

const defaultHeaders: TDNSHeader = {
  id: 1234,
  qr: 1 << 15,
  opcode: OpCode.STANDARD_QUERY,
  aa: 0,
  tc: 0,
  rd: 0,
  ra: 0,
  z: 0,
  rcode: ResponseCode.NO_ERROR,
  qdcount: 0,
  ancount: 0,
  arcount: 0,
  nscount: 0,
};

const defaultQuestion: IDNSQuestion = {
  name: "codecrafters.io",
  classCode: DNSClass.IN,
  type: DNSQuestionType.A,
};

const defaultAnswer: IDNSAnswer = {
  className: DNSClass.IN,
  name: "codecrafters.io",
  ttl: 60,
  type: DNSQuestionType.A,
  data: "\x08\x08\x08\x08",
};

const udpSocket: dgram.Socket = dgram.createSocket("udp4");
udpSocket.bind(2053, "127.0.0.1");

udpSocket.on("message", (data: Buffer, remoteAddr: dgram.RemoteInfo) => {
  try {
    console.log(`Received data from ${remoteAddr.address}:${remoteAddr.port}`);
    const headers = DNSHeader.write({
      ...defaultHeaders,
      qdcount: 1,
      ancount: 1,
    });
    const question = DNSQuestion.write([defaultQuestion]);
    const answer = DNSAnswer.write([defaultAnswer]);
    const response = Buffer.concat([headers, question, answer]);
    udpSocket.send(response, remoteAddr.port, remoteAddr.address);
  } catch (e) {
    console.log(`Error sending data: ${e}`);
  }
});
