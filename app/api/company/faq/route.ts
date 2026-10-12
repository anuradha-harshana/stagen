import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/auth";
import {
  getCompanyFaqData,
  createCompanyFaq,
  updateCompanyFaq,
  deleteCompanyFaq,
  saveCompanyGuardrails,
  saveCompanyDocuments,
  FAQArticle,
  KnowledgeDoc,
} from "@/lib/company/faq";

export async function GET() {
  const company = await requireRole(["company"]);
  const faqData = await getCompanyFaqData(company.id);
  return NextResponse.json(faqData);
}

export async function POST(request: Request) {
  const company = await requireRole(["company"]);
  const body = (await request.json()) as {
    category?: string;
    question?: string;
    answer?: string;
    id?: string;
    guardrails?: string[];
    documents?: KnowledgeDoc[];
  };

  // Support saving guardrails or documents if provided
  if (Array.isArray(body.guardrails)) {
    const guardrails = await saveCompanyGuardrails(company.id, body.guardrails);
    return NextResponse.json({ guardrails }, { status: 200 });
  }

  if (Array.isArray(body.documents)) {
    const documents = await saveCompanyDocuments(company.id, body.documents);
    return NextResponse.json({ documents }, { status: 200 });
  }

  if (!body.category || !body.question || !body.answer) {
    return NextResponse.json(
      { error: "Category, question, and answer are required" },
      { status: 400 }
    );
  }

  const faq = await createCompanyFaq(company.id, {
    category: body.category,
    question: body.question,
    answer: body.answer,
    id: body.id,
  });

  return NextResponse.json({ faq }, { status: 201 });
}

export async function PUT(request: Request) {
  const company = await requireRole(["company"]);
  const body = (await request.json()) as FAQArticle;

  if (!body?.id || !body?.category || !body?.question || !body?.answer) {
    return NextResponse.json(
      { error: "Valid FAQ payload with id, category, question, and answer is required" },
      { status: 400 }
    );
  }

  const updatedFaq = await updateCompanyFaq(company.id, body);
  if (!updatedFaq) {
    return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
  }

  return NextResponse.json({ faq: updatedFaq });
}

export async function DELETE(request: Request) {
  const company = await requireRole(["company"]);
  const searchParams = new URL(request.url).searchParams;
  const faqId = searchParams.get("id");

  if (!faqId) {
    return NextResponse.json({ error: "id parameter is required" }, { status: 400 });
  }

  const deleted = await deleteCompanyFaq(company.id, faqId);
  if (!deleted) {
    return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
