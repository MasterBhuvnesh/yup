const log = (...args: any[]) => {
  if (process.env.NODE_ENV === "development") {
    console.log("[LOG]:", ...args);
  }
};

const error = (...args: any[]) => {
  console.error("[ERROR]:", ...args);
};

export const logger = { log, error };
