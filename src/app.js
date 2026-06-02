import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";
import tagsRoutes from "./routes/tags.routes.js";
import processosRoutes from "./routes/processos.routes.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ mensagem: "API Celeris no ar" });
});

// rotas serão adicionadas aqui nas próximas etapas

app.use("/tags", tagsRoutes);
app.use("/processos", processosRoutes);
app.use(errorHandler);