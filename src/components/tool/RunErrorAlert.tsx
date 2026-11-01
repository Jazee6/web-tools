import { Alert, AlertDescription } from "@/components/ui/alert";

export default function RunErrorAlert({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
