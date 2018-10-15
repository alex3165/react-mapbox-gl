const mainPackage = require('../package.json');
const exPackage = require('../example/package.json');

const allMainDeps = {
  ...mainPackage.dependencies,
  ...mainPackage.peerDependencies,
  ...mainPackage.devDependencies
};

const allExDeps = {
  ...exPackage.dependencies,
  ...exPackage.peerDependencies,
  ...exPackage.devDependencies
};

const res = Object.keys(allMainDeps).filter(
  k => (allExDeps[k] ? allMainDeps[k] !== allExDeps[k] : false)
);

if (res.length > 0) {
  console.error(`Please make sure ${res.join(', ')} versions are inline`);
  process.exit(1);
}
