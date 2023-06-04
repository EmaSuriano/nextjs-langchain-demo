"use server";

import { ChatOpenAI } from "langchain/chat_models/openai";
import { WebBrowser } from "langchain/tools/webbrowser";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

type Request = {
  url: string;
  question: string;
};

export async function streamDemo(req: Request) {
  const model = new ChatOpenAI({
    temperature: 0,
    streaming: true,
  });
  const embeddings = new OpenAIEmbeddings({});

  const browser = new WebBrowser({ model, embeddings });

  return browser.call(`"${req.url}","${req.question}"`);
}
