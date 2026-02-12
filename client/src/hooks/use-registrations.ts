import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import type { InsertRegistration } from "@shared/schema";

export function useCreateRegistration() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: InsertRegistration) => {
      console.log("[DEBUG] Registration request data:", data);
      
      const res = await fetch(api.registrations.create.path, {
        method: api.registrations.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      console.log("[DEBUG] Registration response status:", res.status);
      
      // Try to parse JSON response
      let responseData;
      try {
        responseData = await res.json();
        console.log("[DEBUG] Registration response data:", responseData);
      } catch (e) {
        console.error("[DEBUG] Failed to parse response as JSON:", e);
        throw new Error("Server returned invalid response");
      }
      
      if (!res.ok) {
        throw new Error(responseData.message || "Failed to register");
      }
      
      return responseData;
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "We'll be in touch shortly.",
        className: "bg-primary text-primary-foreground border-none",
      });
    },
    onError: (error: Error) => {
      console.error("[DEBUG] Registration error:", error);
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
