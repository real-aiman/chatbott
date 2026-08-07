import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, MessageCircle, MapPin, Send } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { FloatingBackground } from '../components/ui/FloatingBackground';
import { Button } from '../components/ui/Button';
import { GradientText } from '../components/ui/GradientText';

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Enter a valid email address'),
  subject: z.string().min(3, 'Subject is a little short'),
  message: z.string().min(10, 'Tell us a bit more (10+ characters)'),
});

type ContactForm = z.infer<typeof contactSchema>;

const CONTACT_INFO = [
  { icon: Mail, label: 'Email', value: 'hello@Chatty.app' },
  { icon: MessageCircle, label: 'Chat with us', value: 'Try the assistant', to: '/chat' },
  { icon: MapPin, label: 'Based', value: 'Remote-first, everywhere' },
];

export default function ContactPage() {
  const {
    register, handleSubmit, reset, formState: { errors, isSubmitting },
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactForm) => {
    // No backend — simulate a network round trip so the form feels real.
    await new Promise((r) => setTimeout(r, 900));
    toast.success(`Thanks, ${data.name.split(' ')[0]}! We'll be in touch soon.`);
    reset();
  };

  return (
    <div className="relative min-h-screen">
      <FloatingBackground />
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 pb-24 pt-16">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            Let's <GradientText>talk</GradientText>
          </h1>
          <p className="mt-4 text-current/60">Questions, feedback, or partnership ideas — we'd love to hear them.</p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-4">
            {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
              <div key={label} className="glass flex items-center gap-4 rounded-2xl p-5">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-aura-gradient shadow-glow">
                  <Icon size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-current/40">{label}</p>
                  <p className="text-sm font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <motion.form
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit(onSubmit)}
            className="glass-strong space-y-4 rounded-3xl p-6 sm:p-8"
            noValidate
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" error={errors.name?.message}>
                <input {...register('name')} className="input-field" placeholder="Ada Lovelace" />
              </Field>
              <Field label="Email" error={errors.email?.message}>
                <input {...register('email')} type="email" className="input-field" placeholder="ada@example.com" />
              </Field>
            </div>
            <Field label="Subject" error={errors.subject?.message}>
              <input {...register('subject')} className="input-field" placeholder="How can we help?" />
            </Field>
            <Field label="Message" error={errors.message?.message}>
              <textarea {...register('message')} rows={5} className="input-field resize-none" placeholder="Tell us more…" />
            </Field>
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? 'Sending…' : 'Send message'} <Send size={16} />
            </Button>
          </motion.form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-current/60">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}
