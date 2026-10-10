require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const CHAIN_ID = Number(process.env.USTD_CHAIN_ID || 4644);
const CONTRACT = process.env.USTD_CONTRACT_ADDRESS ||
  "0x4644E1113FE1a6bA831D85cc4772b3D0c23DE655";
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000")
  .split(",").map(s => s.trim()).filter(Boolean);

app.disable("x-powered-by");
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "10kb" }));

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "USTD API",
    chainId: CHAIN_ID,
    rpcConfigured: Boolean(process.env.USTD_RPC_URL),
    contractAddress: CONTRACT,
    note: "Health check only; it does not prove that the contract is deployed."
  });
});

app.post("/api/links", (req, res) => {
  const uri = req.body && req.body.uri;
  if (typeof uri !== "string" || uri.length > 200 ||
      !/^\/[a-zA-Z0-9._/-]+$/.test(uri) || uri.includes("..")) {
    return res.status(400).json({
      ok: false,
      message: "Campo uri inválido. Informe um caminho local permitido."
    });
  }

  // Safe starter behavior: validate and return the requested path.
  // Connect this route to your actual link registry/service before production.
  return res.json({
    ok: true,
    uri,
    message: "Requisição recebida e validada pela API.",
    integrationConfigured: false
  });
});

app.use(express.static(path.join(__dirname, "public")));
app.use((_req, res) => res.status(404).json({ ok: false, message: "Rota não encontrada." }));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`USTD API listening on port ${PORT}`);
});
