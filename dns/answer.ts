import { DNSClass, DNSQuestionType } from "./question";

export interface IDNSAnswer {
  name: string;
  type: DNSQuestionType;
  className: DNSClass;
  ttl: number;
  data: string;
}

class DNSAnswer {
  static write(ans: IDNSAnswer[]) {
    return Buffer.concat(
      ans.map((a) => {
        const { className, data, name, ttl, type } = a;
        const buff = Buffer.alloc(10);
        const str = name
          .split(".")
          .map((s) => `${String.fromCharCode(s.length)}${s}`)
          .join("");

        buff.writeInt16BE(type);
        buff.writeInt16BE(className, 2);
        buff.writeInt16BE(ttl, 4);
        buff.writeInt16BE(data.length, 6);

        return Buffer.concat([
          Buffer.from(str + "\0", "binary"),
          buff,
          Buffer.from(data + "\0", "binary"),
        ]);
      })
    );
  }
}

export default DNSAnswer;
