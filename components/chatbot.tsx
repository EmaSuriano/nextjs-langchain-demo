"use client";
import { useMemo, useState } from "react";
import { streamDemo } from "./streamDemo";
import { z } from "zod";
import ReactMarkdown from "react-markdown";
import { Input } from "./input";

type Status =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "failed"; error: Error }
  | { type: "loaded"; response: string };

const INSTRUCTIONS = `Hello there 👋 Start by filling the form with:
1. The **website** you want to look for
2. You can ask any **question** about it

The request is going to be processed by **LangChain** which:

1. Will get the content of the website
2. Use **OpenAI** to answer the provided question
3. Show the response right here ✨`;

const RequestValidator = z.object({
  url: z.string().url(),
  question: z.string(),
});

function Chatbot() {
  const [status, setStatus] = useState<Status>({ type: "idle" });

  const handleForm = async (data: FormData) => {
    try {
      const request = RequestValidator.parse({
        url: data.get("url"),
        question: data.get("question"),
      });

      const response = await streamDemo(request);
      setStatus({ type: "loaded", response });
    } catch (error: any) {
      console.error(error);
      setStatus({ type: "failed", error });
    }
  };

  return (
    <section className="px-4 py-8  sm:py-16 lg:px-6 ">
      <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
        {`Let's ask the web!`}
      </h2>
      <div className="mx-auto max-w-screen-xl items-start gap-8  md:grid md:grid-cols-2 xl:gap-16">
        <div className="mb-4 md:mt-0">
          <form
            action={handleForm}
            onSubmit={() => setStatus({ type: "loading" })}
          >
            <Input
              type="url"
              name="url"
              label="Website"
              placeholder="https://www.google.com/"
              required
            />

            <Input
              type="text"
              name="question"
              label="Question"
              placeholder="What can I do?"
              required
            />

            <button
              disabled={status.type === "loading"}
              type="submit"
              className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-gray-400 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
            >
              Submit
            </button>
          </form>
        </div>

        <div className="rounded-xl border border-b border-gray-300 bg-gray-200 bg-gradient-to-b from-zinc-200 p-4 pb-6 pt-8 backdrop-blur-2xl  transition-all dark:border-neutral-800 dark:bg-zinc-800/30  dark:from-inherit">
          {(() => {
            switch (status.type) {
              case "idle":
                return (
                  <article className="prose">
                    <ReactMarkdown>{INSTRUCTIONS}</ReactMarkdown>
                  </article>
                );

              case "loading":
                return (
                  <div className="h-20 w-20 animate-spin  rounded-full border-4 border-solid border-blue-600 border-t-transparent"></div>
                );

              case "loaded":
                return (
                  <article className="prose">
                    <ReactMarkdown>{status.response}</ReactMarkdown>
                  </article>
                );

              case "failed":
                return <p>Something happened ... ${status.error.message}</p>;

              default:
                return null;
            }
          })()}
        </div>
      </div>
    </section>
  );
}

export default Chatbot;
