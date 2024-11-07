// 4. install resend after connecting to db
import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);