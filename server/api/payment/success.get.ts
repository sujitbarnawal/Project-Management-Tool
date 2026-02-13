import { db } from '~~/server/database';
import { users } from '~~/server/database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const data = query.data;

    try {
        if (!data) throw new Error("No payment data received");
        
        const decodedString = Buffer.from(data as string, 'base64').toString('utf-8');
        const paymentData = JSON.parse(decodedString);
        
        console.log('Payment data received:', paymentData);
        
        if (paymentData.status !== 'COMPLETE') {
            console.error('Payment not complete. Status:', paymentData.status);
             return sendRedirect(event, '/subscription?error=payment_incomplete');
        }

        const transaction_uuid = paymentData.transaction_uuid;
        const parts = transaction_uuid.split('-');
        if (parts.length < 6) {
            console.error('Invalid transaction_uuid format:', transaction_uuid);
            return sendRedirect(event, '/subscription?error=invalid_transaction');
        }
        const userId = parts.slice(0, 5).join('-');
        
        if (!userId) {
             return sendRedirect(event, '/subscription?error=invalid_transaction');
        }
        
        console.log('Extracted userId:', userId);
 
        const result = await db.update(users)
            .set({ 
                subscriptionPlan: 'premium',
                subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) 
            })
            .where(eq(users.id, userId))
            .returning();

        if (result.length === 0) {
            console.error('User not found for userId:', userId);
            return sendRedirect(event, '/subscription?error=user_not_found');
        }

        console.log('Successfully updated user subscription:', result[0]);
        return sendRedirect(event, '/payment/success');

    } catch (error) {
        console.error("Payment verification error:", error);
         return sendRedirect(event, '/subscription?error=verification_failed');
    }
});
