import { Card } from "@/components/ui/card";
import { Skeleton as SSkeleton } from "@/components/ui/skeleton";

export function Skeleton() {
  return (
    <div>
      <div className="px-4 md:px-4 py-4">
        <SSkeleton className="h-10 md:w-96 w-full" />
      </div>

      <div className="grid md:grid-cols-4 px-4 container gap-6">
        <Card className="w-full h-[360px] bg-gray-100 md:max-w-[316px] shadow-none overflow-hidden rounded-lg border-none transition-all"></Card>
        <Card className="w-full h-[360px] bg-gray-100 md:max-w-[316px] shadow-none overflow-hidden rounded-lg border-none transition-all"></Card>
        <Card className="w-full h-[360px] bg-gray-100 md:max-w-[316px] shadow-none overflow-hidden rounded-lg border-none transition-all"></Card>
        <Card className="w-full h-[360px] bg-gray-100 md:max-w-[316px] shadow-none overflow-hidden rounded-lg border-none transition-all"></Card>
        <Card className="w-full h-[360px] bg-gray-100 md:max-w-[316px] shadow-none overflow-hidden rounded-lg border-none transition-all"></Card>
        <Card className="w-full h-[360px] bg-gray-100 md:max-w-[316px] shadow-none overflow-hidden rounded-lg border-none transition-all"></Card>
        <Card className="w-full h-[360px] bg-gray-100 md:max-w-[316px] shadow-none overflow-hidden rounded-lg border-none transition-all"></Card>
        <Card className="w-full h-[360px] bg-gray-100 md:max-w-[316px] shadow-none overflow-hidden rounded-lg border-none transition-all"></Card>
        <Card className="w-full h-[360px] bg-gray-100 md:max-w-[316px] shadow-none overflow-hidden rounded-lg border-none transition-all"></Card>
        <Card className="w-full h-[360px] bg-gray-100 md:max-w-[316px] shadow-none overflow-hidden rounded-lg border-none transition-all"></Card>
      </div>
    </div>
  );
}
