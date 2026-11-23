import { NextResponse } from "next/server";
import { getDemoSession } from "@/lib/demo-session";
import { getPatientProfile } from "@/lib/patient/profile";
import { verifyPatientAccessCode } from "@/lib/patient/verify-access-code";

function escapePdf(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildMinimalPdf(title: string, lines: string[]) {
  let y = 750;
  const body = lines
    .map((line) => {
      const chunk = `BT /F1 12 Tf 50 ${y} Td (${escapePdf(line)}) Tj ET\n`;
      y -= 18;
      return chunk;
    })
    .join("");
  const header = `BT /F1 18 Tf 50 770 Td (${escapePdf(title)}) Tj ET\n`;
  const stream = header + body;
  const len = stream.length;

  return Buffer.from(
    `%PDF-1.1
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<</Font<</F1 5 0 R>>>>/Contents 4 0 R>>endobj
4 0 obj<</Length ${len}>>stream
${stream}endstream
endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000114 00000 n 
0000000220 00000 n 
0000000500 00000 n 
trailer<</Size 6/Root 1 0 R>>
startxref
600
%%EOF`,
    "utf-8",
  );
}

export async function GET(request: Request) {
  const session = await getDemoSession();
  if (!session || (session.role !== "patient" && session.role !== "doctor" && session.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const doc = url.searchParams.get("doc") ?? "summary";
  const code = url.searchParams.get("code") ?? "";
  if (code) {
    const gate = await verifyPatientAccessCode(session, code);
    if (!gate.ok) return NextResponse.json({ error: gate.reason ?? "denied" }, { status: 403 });
  } else if (session.role === "patient") {
    return NextResponse.json({ error: "code_required" }, { status: 403 });
  }

  const profile = session.role === "patient" ? await getPatientProfile(session.email) : null;
  const patientEmail = profile?.email ?? session.email;
  const serial = profile?.patientSerial ?? (code || "PSL-UNKNOWN");
  const lines = [
    `Patient: ${profile?.fullName || patientEmail}`,
    `Serial: ${serial}`,
    `Wilaya: ${profile?.wilayaCode || "—"}`,
    `Document: ${doc}`,
    `Generated: ${new Date().toISOString().slice(0, 10)}`,
    "PeSSiLi encrypted patient record (demo export)",
  ];

  const pdf = buildMinimalPdf("PeSSiLi Medical Record", lines);
  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="pessili-${doc}.pdf"`,
    },
  });
}