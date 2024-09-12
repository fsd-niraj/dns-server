export enum DNSQuestionType {
  A = 1,
  NS = 2,
}

export enum DNSClass {
  IN = 1,
}

export interface IDNSQuestion {
  name: string;
  type: DNSQuestionType;
  classCode: DNSClass;
}

class DNSQuestion {
  static write(question: IDNSQuestion[]) {
    return Buffer.concat(
      question.map((q: IDNSQuestion) => {
        const { classCode, name, type } = q;
        const str = name
          .split(".")
          .map((n) => `${String.fromCharCode(n.length)}${n}`)
          .join("");

        const typeAndClass = Buffer.alloc(4);
        typeAndClass.writeInt16BE(type);
        typeAndClass.writeInt16BE(classCode, 2);

        return Buffer.concat([Buffer.from(str + "\0", "binary"), typeAndClass]);
      })
    );
  }
}

export default DNSQuestion;
