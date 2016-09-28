interface TouchEmulator {
  (): void;
}

declare module "touch-emulator" {
  var touchEmulator: TouchEmulator;

  export = touchEmulator;
}
