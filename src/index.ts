import app from "./app";
import { config } from "./config";

// Start the Express server
app.listen(config.port, () => {
  console.log(`🚀 Server is running on port ${config.port}`);
  console.log(`🔗 Access it at http://localhost:${config.port}`);
});
