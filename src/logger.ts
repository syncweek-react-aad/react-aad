export class Logger {
  public static verbose(message: string, ...optionalParams: any[]) {
    console.log.apply(console, ['[VERBOSE] ' + message].concat(optionalParams));
  }

  public static info(message: string, ...optionalParams: any[]) {
    console.info.apply(console, ['[INFO] ' + message].concat(optionalParams));
  }

  public static warn(message: string, ...optionalParams: any[]) {
    console.warn.apply(console, ['[WARN] ' + message].concat(optionalParams));
  }

  public static error(message: string, ...optionalParams: any[]) {
    console.error.apply(console, ['[ERROR] ' + message].concat(optionalParams));
  }
}
