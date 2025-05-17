import xml2js from "xml2js";

const parseXML = async (xmlData) => {
  return await xml2js.parseStringPromise(xmlData);
};

export { parseXML };
