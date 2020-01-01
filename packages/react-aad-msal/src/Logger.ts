export class Logger {
  public static VERBOSE(message: string, ...optionalParams: any[]) {
    // eslint-disable-next-line no-console
    console.log(...['[VERBOSE] ' + message].concat(optionalParams));
  }

  public static INFO(message: string, ...optionalParams: any[]) {
    // eslint-disable-next-line no-console
    console.info(...['[INFO] ' + message].concat(optionalParams));
  }

  public static WARN(message: string, ...optionalParams: any[]) {
    // eslint-disable-next-line no-console
    console.warn(...['[WARN] ' + message].concat(optionalParams));
  }

  public static ERROR(message: string, ...optionalParams: any[]) {
    // eslint-disable-next-line no-console
    console.error(...['[ERROR] ' + message].concat(optionalParams));
  }
}
