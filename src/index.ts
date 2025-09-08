import app from "./app";
import logger from "./utils/logger";

import { PORT } from "./config/constants";

const port = PORT;

app.listen(port, () => {
  logger.info(`🚀 Server is running on http://localhost:${port} 🌍`);
});
