import { writable, derived, get } from "svelte/store";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("1234567890abcdef", 10);

// data model:
// title, base, identifier
// concepts [concept1, concept2, ...]
//   concept1 {identifier, properties [prop1, prop2, ...], narrower [n1, n2,...], broader [b1, b2,...]}
//     prop1 {id, predicate {id, predicate, valueType, dataType, uri}, object {objectValue, objectType}}

// get data from local storage
const stored = JSON.parse(localStorage.getItem('concepts'))

export const selectedConcept = writable({});

export const concepts = createConcepts();

export const serializedTurtle = writable("")

// save every change to local storage
concepts.subscribe((value) => localStorage.concepts = JSON.stringify(value))

function createConcepts() {
  const { subscribe, update, set } = writable(stored || []);
  return {
    subscribe,
    update,
    set,
    addConcept: () => addConcept(),
    addNarrowerConcept: (identifier) => addConcept(identifier),
    getChildren: (childIds) => {
      let res;
      concepts.subscribe((v) => {
        res = v.filter((c) => childIds.includes(c.identifier));
      });
      return res;
    },
    updateProperties: (identifier, predicates) =>
      updateProperties(identifier, predicates),
    updateObject: (conceptIdentifier, propertyIdentifier, predicate, object) =>
      updateObject(conceptIdentifier, propertyIdentifier, predicate, object),
    updateIdentifier: (conceptIdentifier, newIdentifier) =>
      updateIdentifier(conceptIdentifier, newIdentifier),
    updateSubject: (identifier, subject) => updateSubject(identifier, subject),
    deleteConcept: (identifier) => deleteConcept(identifier),
  };
}

function createConcept(conceptIdentifier = nanoid(5), broader = []) {
  return {
    identifier: conceptIdentifier,
    subject: nanoid(5),
    properties: [
      {
        id: nanoid(5),
        predicate: {},
        object: {},
      },
    ],
    narrower: [],
    broader: broader,
  };
}

function addConcept(parentIdentifier = null) {
  if (parentIdentifier !== null) {
    // add new concept with its parent
    console.log(
      `add narrower concept with parent identifier: ${parentIdentifier}`
    );
    const conceptIdentifier = nanoid(5);
    const narrowerConcept = createConcept(conceptIdentifier, [
      parentIdentifier,
    ]);
    concepts.update(($concepts) => {
      $concepts = $concepts.concat(narrowerConcept);
      $concepts = $concepts.map((c) =>
        c.identifier === parentIdentifier
          ? { ...c, narrower: c.narrower.concat(conceptIdentifier) }
          : c
      );
      return $concepts;
    });
  } else {
    concepts.update(($concepts) => {
      console.log(`add top concept`);
      $concepts = $concepts.concat(createConcept());
      return $concepts;
    });
  }
}

function updateIdentifier(conceptIdentifier, newIdentifier) {
  console.log(conceptIdentifier);
  console.log(newIdentifier)
  console.info("update identifier");
  concepts.update(($concepts) => {
    $concepts = $concepts.map((c) => {
      if (c.subject === conceptIdentifier) {
        return { c, subject: newIdentifier };
      } else if (c.narrower && c.narrower.includes(conceptIdentifier)) {
        return {
          ...c,
          narrower: c.narrower.map((n) => {
            return n === conceptIdentifier ? newIdentifier : n;
          }),
        };
      } else if (c.broader && c.broader.includes(conceptIdentifier)) {
        return {
          ...c,
          broader: c.broader.map((b) => {
            return b === conceptIdentifier ? newIdentifier : b;
          }),
        };
      } else {
        return c;
      }
    });
    console.log($concepts)
    return $concepts;
  });
}

function updateObject(
  conceptIdentifier,
  propertyIdentifier,
  predicate,
  object
) {
  console.log("updateObject");
  object.objectValue &&
    object.objectType !== "none" &&
    concepts.update(($concepts) => {
      $concepts = $concepts.map((c) => {
        if (c.identifier === conceptIdentifier) {
          const properties = c.properties.map((p) => {
            if (p.id === propertyIdentifier) {
              const prop = {
                id: propertyIdentifier,
                predicate: predicate,
                object: object,
              };
              console.log(prop);
              return prop;
            } else {
              return p;
            }
          });
          return { ...c, properties: properties };
        } else {
          return c;
        }
      });
      return $concepts;
    });
}

function addProperty(identifier) {
  let conceptProperties = $concepts.find(
    (c) => c.identifier === concept.identifier
  ).properties;
  conceptProperties = conceptProperties.concat({
    id: nanoid(5),
    predicate: {},
    object: {},
  });
  concepts.updateProperties(identifier, conceptProperties);
}

function updateProperties(identifier, predicates) {
  concepts.update(($concepts) => {
    $concepts = $concepts.map((c) =>
      c.identifier === identifier ? { ...c, properties: predicates } : c
    );
    return $concepts;
  });
}

function updateSubject(identifier, newSubject) {
  console.info("update subject")
  let success = false;
  concepts.update($concepts => {
    if ($concepts.filter(c => c.subject === newSubject).length >= 1) {
      alert('That identifier is already taken, please take another one.')
      $concepts = $concepts
      return $concepts
    } else {
      console.log("everything alright changing subject")
      $concepts = $concepts.map(c => c.identifier === identifier ? { ...c, subject: newSubject } : c)
      success = true;
      return $concepts
    }
  })
  return success
}

function deleteConcept(identifier) {
  // TODO implement a modal to ask for confirmation
  concepts.update($concepts => {
    const positionOfConcept = $concepts.findIndex(c => c.identifier === identifier)
    selectedConcept.set($concepts[positionOfConcept - 1])
    $concepts = $concepts.map(c => {
    if (c.narrower.includes(identifier)) {
      return {
        ...c,
        narrower: c.narrower.filter(n => n !== identifier),
      };
    }
    if (c.broader.includes(identifier)) {
      return {
        ...c,
        broader: c.broader.filter(n => n !== identifier),
      };
    }
    return c;
  }).filter(c => c?.identifier !== identifier)
    return $concepts
  })
}

export const conceptTree = derived(concepts, ($concepts) => {
  const data = createDataTree($concepts);
  console.log("data is");
  console.log(data);
  return data;
});

const createDataTree = (dataset) => {
  console.log(dataset);
  const hashTable = Object.create(null);
  dataset.forEach(
    (aData) => (hashTable[aData.identifier] = { ...aData, children: [] })
  );
  let dataTree = [];
  dataset.forEach((Datae) => {
    if (Datae.broader && Datae.broader.length > 0) {
      Datae.broader.forEach((aData) => {
        hashTable[aData].children.push(hashTable[Datae.identifier]);
      });
    } else {
      dataTree.push(hashTable[Datae.identifier]);
    }
  });
  return dataTree;
};
