'use strict';
async function main() {
  try {
    const data = await d3.csv('/data.csv');
 // todo   
  } catch (err) {
    console.log(err);
  }
}
main();
