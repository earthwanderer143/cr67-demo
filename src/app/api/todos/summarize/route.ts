import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

type SummarizeRequestBody = {
	title?: unknown;
};

function isNonEmptyString(value: unknown): value is string {
	return typeof value === "string" && value.trim().length > 0;
}

export async function POST(req: Request) {
	try {
		const apiKey = process.env.OPENAI_API_KEY;
		if (!apiKey) {
			return NextResponse.json(
				{ error: "Missing OPENAI_API_KEY environment variable." },
				{ status: 500 }
			);
		}

		let body: SummarizeRequestBody;
		try {
			body = (await req.json()) as SummarizeRequestBody;
		} catch {
			return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
		}

		const title = body?.title;
		if (!isNonEmptyString(title)) {
			return NextResponse.json(
				{ error: 'Invalid input. Expected JSON body: { "title": string }.' },
				{ status: 400 }
			);
		}

		const client = new OpenAI({ apiKey });

		const response = await client.responses.create({
			model: "gpt-4.1-mini",
			input: [
				{
					role: "system",
					content:
						"You are a helpful assistant that summarizes todo items. Return exactly one concise sentence describing what the task involves. Do not use bullet points. Do not add extra commentary.",
				},
				{
					role: "user",
					content: `Todo title: ${title.trim()}\n\nWrite a one-sentence summary/breakdown of what this task involves.`,
				},
			],
		});

		const summary = (response.output_text ?? "").trim();

		if (!summary) {
			return NextResponse.json(
				{ error: "Failed to generate summary." },
				{ status: 500 }
			);
		}

		return NextResponse.json({ summary }, { status: 200 });
	} catch {
		return NextResponse.json(
			{ error: "OpenAI request failed." },
			{ status: 500 }
		);
	}
}