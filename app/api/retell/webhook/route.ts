import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    console.log('[Retell Webhook] Received event:', payload.event);

    if (payload.event === 'call_ended') {
      const { call_id, retell_llm_dynamic_variables } = payload.call;
      const complaintId = retell_llm_dynamic_variables?.complaint_id;
      
      // Look for the confirmation decision in the post-call analysis
      // Note: This matches the "confirmation_decision" variable we'll set in the agent
      const variables = payload.call.transcript_with_tool_calls?.[0]?.content || '';
      const decision = payload.call.post_call_analysis?.custom_analysis_data?.confirmation_decision;

      console.log(`[Retell Webhook] Call ${call_id} ended for complaint ${complaintId}. Decision: ${decision}`);

      if (complaintId) {
        if (decision === 'Yes' || decision === 'Haan') {
          await prisma.complaint.update({
            where: { id: complaintId },
            data: { isConfirmed: true }
          });
          console.log(`[Retell Webhook] Complaint ${complaintId} CONFIRMED.`);
        } else if (decision === 'No' || decision === 'Nahi') {
          // You could delete or mark as rejected
          await prisma.complaint.update({
            where: { id: complaintId },
            data: { status: 'REJECTED' }
          });
          console.log(`[Retell Webhook] Complaint ${complaintId} REJECTED by user.`);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Retell Webhook] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
