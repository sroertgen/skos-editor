export const languages = ["de", "en", "fr"];

const skosUri = "http://www.w3.org/2004/02/skos/core#";

const skos = [
  {
    id: 0,
    predicate: "skos:prefLabel",
    valueType: "Literal",
    dataType: "Language",
  },
  {
    id: 1,
    predicate: "skos:altlabel",
    valueType: "Literal",
    dataType: "Language",
  },
  {
    id: 2,
    predicate: "skos:hiddenLabel",
    valueType: "Literal",
    dataType: "Language",
  },
  { id: 3, predicate: "skos:related", valueType: "Uri" },
];

export const skosPredicates = skos.map((e) => {
  const uri = skosUri + e.predicate.replace(/^skos:/, "");
  return { ...e, uri };
});

export const literals = skosPredicates
  .filter((e) => e.valueType === "Literal")
  .map((e) => e.predicate);
