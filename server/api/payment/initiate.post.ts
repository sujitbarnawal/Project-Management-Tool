import script from 'crypto';

export default defineEventHandler(async (event) => {
    const user = event.context.user;
    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        });
    }

    const { total_amount } = await readBody(event);
    const transaction_uuid = `${user.id}-${Date.now()}`;
    const product_code = "EPAYTEST";
    const secret = "8gBm/:&EnhH.1/q"; 
    
    const data = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    
    const hmac = script.createHmac('sha256', secret);
    hmac.update(data);
    const signature = hmac.digest('base64');
    
    return {
        signature,
        signed_field_names: 'total_amount,transaction_uuid,product_code',
        transaction_uuid
    };
});
