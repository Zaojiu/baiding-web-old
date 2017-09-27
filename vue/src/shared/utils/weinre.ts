import {host} from "../../env/environment";

if (host.weinre && location.search.indexOf('debug=weinre') !== -1) {
  const script = document.createElement('script');
  script.src = `${host.weinre}/target/target-script-min.js#anonymous`;
  document.body.appendChild(script);
}

export default {};
