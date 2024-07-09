import fs from "node:fs";
import express from "express";
import { PrismaClient } from "@prisma/client";
import escapeHTML from "escape-html";

const responseList = ["Hello", "Hi", "Hey", "Good morning", "Good evening"]; 


function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}


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
  await prisma.post.create({
    data: { message: responseList[getRandomIntInclusive(0, responseList.length - 1)]},
  });
  response.redirect("/");
});

app.listen(3000);
