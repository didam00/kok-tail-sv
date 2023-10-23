let bottles = [
  {
    name: 'Jack Daniel\'s',
    key: 'jack_daniel',
    src: "jack_daniel",
    ml: 540,
  },
  {
    name: 'X-Rated',
    key: 'xrated',
    src: "xrated",
    ml: 540,
  },
  {
    name: 'Absolut Vodka',
    key: 'absolut',
    src: "absolut",
    ml: 540,
  },
  {
    name: 'Bacardi Carta Blanca',
    key: 'bacardi_rum',
    src: "bacardi_rum",
    ml: 540,
  },
  {
    name: 'Peachtree',
    key: 'peachtree',
    src: "peachtree",
    ml: 540,
  },
];

export function load() {
  return {
    bottles
  };
}