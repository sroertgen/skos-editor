import * as $rdf from 'rdflib';

const getSubjectFromIdentifier = (concepts, identifier) => {
  return concepts.find(c => c.identifier === identifier).subject
}

const dctermsURI = 'http://purl.org/dc/terms/'
const skosURI = 'http://www.w3.org/2004/02/skos/core#'
const vannURI = 'http://purl.org/vocab/vann/'

const RDF = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
const SKOS = $rdf.Namespace(skosURI);
const DCTERMS = $rdf.Namespace(dctermsURI);
const VANN = $rdf.Namespace(vannURI);

const serializeSKOS = (data) => {
  const conceptMissingPrefLabels = data.concepts.filter(c => !c.properties.some(p => p.predicate.uri === skosURI + "prefLabel"))
  if (conceptMissingPrefLabels.length) {
    alert("Missed some prefLabels for concepts: " + conceptMissingPrefLabels.map(c => c.subject).join(", "));
    return "Fix prefLabels for: " + conceptMissingPrefLabels.map(c => c.subject).join(", ")
  }
  const baseURI = $rdf.sym(data.base);
  const base = $rdf.Namespace(data.base)

  const store = $rdf.graph();
  store.setPrefixForURI('skos', 'http://www.w3.org/2004/02/skos/core#')
  if (data?.identifier) {
    store.setPrefixForURI(data.identifier, data.base)
		store.add(baseURI, VANN('preferredNamespaceUri'), $rdf.literal(data.base));
		store.add(baseURI, VANN('preferredNamespacePrefix'), $rdf.literal(data.identifier));
  } 

  store.add(baseURI, RDF("type"), SKOS("ConceptScheme"))
  store.add(baseURI, DCTERMS("title"), $rdf.literal(data.title, "en"))
  store.add(baseURI, DCTERMS("description"), $rdf.literal(data.description, "en"))

  const topConcepts = data.concepts.filter(c => !c.broader.length).map(c => c.subject)
  topConcepts.forEach(c => {
    store.add(baseURI, SKOS("hasTopConcept"), base(c))
  })

  for (let c of data.concepts) {
    store.add(base(c.subject), RDF("type"), SKOS("Concept"))
    if (!c.broader.length) {
      store.add(base(c.subject), SKOS("topConceptOf"), baseURI)
    } else {
      store.add(base(c.subject), SKOS("inScheme"), baseURI)
    }
    try {

      if (c.narrower.length) {
        c.narrower.forEach(n => {
          store.add(base(c.subject), SKOS("narrower"), base(getSubjectFromIdentifier(data.concepts, n)))
        })
      }
      if (c.broader.length) {
        c.broader.forEach(b => {
          store.add(base(c.subject), SKOS("broader"), base(getSubjectFromIdentifier(data.concepts, b)))
        })
      }
      c.properties.forEach(p => {
        if (p.predicate.valueType === "Literal") {
          store.add(base(c.subject), $rdf.sym(p.predicate.uri), $rdf.literal(p.object.objectValue, p.object.objectType))
        }
      })
    }
    catch (e) {
      continue
    }
  }


  return $rdf.serialize(null, store, null, 'text/turtle');
};

export { serializeSKOS };
