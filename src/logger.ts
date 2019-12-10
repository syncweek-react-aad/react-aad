export class Logger {
  public static VERBOSE(message: string, ...optionalParams: any[]) {
    // tslint:disable-next-line: no-console
    console.log.apply(console, ['[VERBOSE] ' + message].concat(optionalParams));
  }

  public static INFO(message: string, ...optionalParams: any[]) {
    // tslint:disable-next-line: no-console
    console.info.apply(console, ['[INFO] ' + message].concat(optionalParams));
  }

  public static WARN(message: string, ...optionalParams: any[]) {
    // tslint:disable-next-line: no-console
    console.warn.apply(console, ['[WARN] ' + message].concat(optionalParams));
  }

  public static ERROR(message: string, ...optionalParams: any[]) {
    // tslint:disable-next-line: no-console
    console.error.apply(console, ['[ERROR] ' + message].concat(optionalParams));
  }
}
