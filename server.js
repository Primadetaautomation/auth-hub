{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import express from "express";\
import querystring from "node:querystring";\
\
const app = express();\
const PORT = process.env.PORT || 3000;\
\
const ALLOWED_HOSTS = (process.env.ALLOWED_HOSTS ?? "")\
  .split(",")\
  .filter(Boolean);\
\
app.get("/oauth2/callback", (req, res) => \{\
  const \{ state, ...rest \} = req.query;\
  if (!state) return res.status(400).send("Missing state");\
\
  try \{\
    const url = new URL(Buffer.from(state, "base64url").toString("utf8"));\
    if (\
      ALLOWED_HOSTS.length &&\
      !ALLOWED_HOSTS.some((pat) =>\
        pat.startsWith("*.") ? url.hostname.endsWith(pat.slice(2)) : url.hostname === pat\
      )\
    ) \{\
      return res.status(403).send("Untrusted target");\
    \}\
\
    const qs = querystring.stringify(\{ ...rest, state \});\
    return res.redirect(307, `$\{url.origin\}/oauth2/callback?$\{qs\}`);\
  \} catch \{\
    return res.status(400).send("Invalid state");\
  \}\
\});\
\
app.listen(PORT, () => console.log(`OAuth hub running on port $\{PORT\}`));\
}