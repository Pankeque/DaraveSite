import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRegistrationSchema, type InsertRegistration } from "@shared/schema";
import { useCreateRegistration } from "@/hooks/use-registrations";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface RegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RegistrationModal({ open, onOpenChange }: RegistrationModalProps) {
  const { mutate, isPending } = useCreateRegistration();
  
  const form = useForm<InsertRegistration>({
    resolver: zodResolver(insertRegistrationSchema),
    defaultValues: {
      email: "",
      interest: "Game Development",
    },
  });

  const onSubmit = (data: InsertRegistration) => {
    mutate(data, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-md p-0 overflow-hidden gap-0 max-h-[85vh]">
        <div className="bg-primary/10 p-6 border-b border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold tracking-tighter text-white">Join Darave Studios</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Enter your email to get started with our creative group.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-zinc-300">Email Address</label>
            <input
              {...form.register("email")}
              className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
              placeholder="you@example.com"
            />
            {form.formState.errors.email && (
              <p className="text-red-400 text-xs mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="interest" className="text-sm font-medium text-zinc-300">Area of Interest</label>
            <select
              {...form.register("interest")}
              className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 appearance-none cursor-pointer"
            >
              <option value="Game Development">Game Development</option>
              <option value="Asset Purchase">Asset Purchase</option>
              <option value="Game Buying">Game Buying</option>
              <option value="Portfolio">Portfolio Inquiry</option>
            </select>
          </div>

          <div className="pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isPending}
              type="submit"
              className="w-full py-3.5 rounded-lg bg-primary text-black font-bold text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Registering...
                </span>
              ) : (
                "Register Now"
              )}
            </motion.button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
