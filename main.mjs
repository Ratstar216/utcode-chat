import fs from "node:fs";
import express from "express";
import { PrismaClient } from "@prisma/client";
import escapeHTML from "escape-html";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("static"));
const prisma = new PrismaClient();

const template = fs.readFileSync("./template.html", "utf-8");
app.get("/", async (request, response) => {
  const posts = await prisma.todo.findMany();
  const html = template.replace(
    "<!-- posts -->",
    posts.map((post) => `<li>${escapeHTML(post.name)}</li>`).join(""),
  );
  response.send(html);
});

app.post("/send", async (request, response) => {
  await prisma.todo.create({
    data: { name: request.body.message },
  });
  response.redirect("/");
});

app.listen(3000);
