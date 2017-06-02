import {environment} from "../../../environments/environment";

if (environment.enableWeinre) {
  const script = document.createElement('script');
  script.src = `${environment.config.host.werinre}/target/target-script-min.js#anonymous`;
  document.body.appendChild(script);
}

export default {};
