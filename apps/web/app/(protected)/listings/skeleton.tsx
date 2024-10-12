import { Card } from "@/components/ui/card";
import { Skeleton as SSkeleton } from "@/components/ui/skeleton";

export function Skeleton() {
  return (
    <div>
      <div className="px-8 py-4">
        <SSkeleton className="h-10 w-96" />
      </div>

      <div className="grid md:grid-cols-4 container gap-6">
        <Card className="w-full h-[360px] bg-gray-100 max-w-[316px] shadow-none overflow-hidden rounded-lg border-none transition-all"></Card>
        <Card className="w-full h-[360px] bg-gray-100 max-w-[316px] shadow-none overflow-hidden rounded-lg border-none transition-all"></Card>
        <Card className="w-full h-[360px] bg-gray-100 max-w-[316px] shadow-none overflow-hidden rounded-lg border-none transition-all"></Card>
        <Card className="w-full h-[360px] bg-gray-100 max-w-[316px] shadow-none overflow-hidden rounded-lg border-none transition-all"></Card>
        <Card className="w-full h-[360px] bg-gray-100 max-w-[316px] shadow-none overflow-hidden rounded-lg border-none transition-all"></Card>
        <Card className="w-full h-[360px] bg-gray-100 max-w-[316px] shadow-none overflow-hidden rounded-lg border-none transition-all"></Card>
        <Card className="w-full h-[360px] bg-gray-100 max-w-[316px] shadow-none overflow-hidden rounded-lg border-none transition-all"></Card>
        <Card className="w-full h-[360px] bg-gray-100 max-w-[316px] shadow-none overflow-hidden rounded-lg border-none transition-all"></Card>
        <Card className="w-full h-[360px] bg-gray-100 max-w-[316px] shadow-none overflow-hidden rounded-lg border-none transition-all"></Card>
        <Card className="w-full h-[360px] bg-gray-100 max-w-[316px] shadow-none overflow-hidden rounded-lg border-none transition-all"></Card>
      </div>
    </div>
  );
}
