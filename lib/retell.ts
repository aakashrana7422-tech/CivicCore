import Retell from 'retell-sdk';

const retellClient = new Retell({
  apiKey: process.env.RETELL_API_KEY || '',
});

/**
 * Triggers an outbound AI voice call using Retell.
 * @param to The phone number to call (E.164 format)
 * @param userName The name of the user to address
 * @param issueTitle The title of the civic issue that was resolved
 */
export async function triggerResolutionCall(to: string, userName: string, issueTitle: string) {
  if (!process.env.RETELL_API_KEY || !process.env.RETELL_AGENT_ID) {
    console.warn('[Retell] API Key or Agent ID missing. Skipping call.');
    return;
  }

  try {
    console.log(`[Retell] Triggering resolution call to ${to} for issue: ${issueTitle}`);
    
    const response = await retellClient.call.createPhoneCall({
      from_number: process.env.RETELL_FROM_NUMBER || '',
      to_number: to,
      override_agent_id: process.env.RETELL_AGENT_ID,
      retell_llm_dynamic_variables: {
        user_name: userName,
        issue_title: issueTitle,
      },
    });

    console.log(`[Retell] Call initiated successfully. Call ID: ${response.call_id}`);
    return { success: true, callId: response.call_id };
  } catch (error) {
    console.error('[Retell] Failed to trigger call:', error);
    return { success: false, error };
  }
}

/**
 * Triggers a bilingual confirmation call after a report is filed.
 * @param to The phone number to call
 * @param userName The name of the user
 * @param issueTitle The title of the issue
 * @param complaintId The database ID of the complaint
 */
export async function triggerConfirmationCall(to: string, userName: string, issueTitle: string, complaintId: string) {
  if (!process.env.RETELL_API_KEY || !process.env.RETELL_AGENT_ID) {
    console.warn('[Retell] API Key or Agent ID missing. Skipping confirmation call.');
    return;
  }

  try {
    console.log(`[Retell] Triggering confirmation call to ${to} for complaint: ${complaintId}`);
    
    // For bilingual support, we use the same agent but the prompt handles the choice
    const response = await retellClient.call.createPhoneCall({
      from_number: process.env.RETELL_FROM_NUMBER || '',
      to_number: to,
      override_agent_id: process.env.RETELL_AGENT_ID,
      retell_llm_dynamic_variables: {
        user_name: userName,
        issue_title: issueTitle,
        complaint_id: complaintId
      },
    });

    console.log(`[Retell] Confirmation call initiated. Call ID: ${response.call_id}`);
    return { success: true, callId: response.call_id };
  } catch (error) {
    console.error('[Retell] Failed to trigger confirmation call:', error);
    return { success: false, error };
  }
}
