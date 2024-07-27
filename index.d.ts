export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_URL: string;
      DB_NAME: string;
    }
  }
}
