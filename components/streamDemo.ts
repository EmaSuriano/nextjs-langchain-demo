"use server";

import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage, SystemChatMessage } from "langchain/schema";
import { CallbackManager } from "langchain/callbacks";
import { PromptTemplate, LLMChain } from "langchain";
import { WebBrowser } from "langchain/tools/webbrowser";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { OpenAI } from "langchain/llms/openai";
import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import { PlanAndExecuteAgentExecutor } from "langchain/experimental/plan_and_execute";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

const prompt = PromptTemplate.fromTemplate(
  "What is a good name for a company that makes {product}?"
);

type Request = {
  url: string;
  question: string;
};

export async function streamDemo(req: Request) {
  const model = new ChatOpenAI({
    temperature: 0,
  });
  const embeddings = new OpenAIEmbeddings();

  const browser = new WebBrowser({ model, embeddings });

  return browser.call(`"${req.url}","${req.question}"`);
}
