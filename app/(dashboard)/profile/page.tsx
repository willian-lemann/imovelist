"use client";

import { useState } from "react";
import { Camera, Mail, User, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/lib/queries/use-user";
import BlurFade from "@/components/magicui/blur-fade";

export default function ProfilePage() {
  const { user, isPremium } = useUser();
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    // Profile update implementation
    setTimeout(() => setSaving(false), 1000);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <BlurFade delay={0}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your account settings
          </p>
        </div>
      </BlurFade>

      <BlurFade delay={0.1} inView>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-xl font-semibold">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Camera className="w-3.5 h-3.5" /> Change photo
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    defaultValue={user?.name || ""}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    defaultValue={user?.email || ""}
                    disabled
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Subscription</Label>
                <div className="flex items-center gap-2">
                  <Badge variant={isPremium ? "default" : "secondary"}>
                    {isPremium ? "Professional" : "Free"}
                  </Badge>
                </div>
              </div>

              <Button type="submit" disabled={saving} className="gap-1.5">
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Changes
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </BlurFade>
    </div>
  );
}
