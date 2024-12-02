import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { insertFeatureRequestSchema, type InsertFeatureRequest } from "@db/schema";
import { useFeatureRequests } from "../hooks/use-feature-requests";

interface Props {
  onSuccess: () => void;
}

export default function FeatureRequestForm({ onSuccess }: Props) {
  const { createFeatureRequest } = useFeatureRequests();
  
  const form = useForm<InsertFeatureRequest>({
    resolver: zodResolver(insertFeatureRequestSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      contactInfo: "",
      status: "open",
    },
  });

  const { toast } = useToast();

  const onSubmit = async (data: InsertFeatureRequest) => {
    try {
      await createFeatureRequest(data);
      toast({
        title: "Success",
        description: "Feature request created successfully",
      });
      onSuccess();
      form.reset();
    } catch (error: any) {
      console.error("Error creating feature request:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create feature request",
        variant: "destructive",
      });
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>New Feature Request</DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe the feature request"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Info (optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="How can we reach you?"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Submit Request
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
}
