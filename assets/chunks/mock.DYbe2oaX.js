const e=`export default function getData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Array.from({ length: 10 }).fill(0).map((_, index) => ({
        value: index,
        label: \`Option \${index}\`,
      })))
    }, 1000)
  })
}
`;export{e as default};
