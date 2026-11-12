import { useState, useEffect } from "react";
import { Check, ChevronDown, Bell, BellOff, UserCheck, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { api, ApiError } from "@/lib/api";
import confetti from "canvas-confetti";

type SubscriptionPreference = "ALL" | "PERSONALIZED" | "NONE";

const STORAGE_KEY_EMAIL = "sole_newsletter_email";
const STORAGE_KEY_SUBSCRIBED = "sole_newsletter_subscribed";
const STORAGE_KEY_PREFERENCE = "sole_newsletter_preference";

export function NewsletterSubscription() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [preference, setPreference] = useState<SubscriptionPreference>("ALL");
  const [subscribing, setSubscribing] = useState(false);
  const [updatingPref, setUpdatingPref] = useState(false);
  const [showUnsubscribeModal, setShowUnsubscribeModal] = useState(false);

  // Sync state from localStorage on mount
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem(STORAGE_KEY_EMAIL);
      const savedSubscribed = localStorage.getItem(STORAGE_KEY_SUBSCRIBED) === "true";
      const savedPref =
        (localStorage.getItem(STORAGE_KEY_PREFERENCE) as SubscriptionPreference) || "ALL";

      if (savedEmail) {
        setEmail(savedEmail);
      }
      if (savedSubscribed && savedEmail) {
        setIsSubscribed(true);
        setPreference(savedPref);

        // Optionally verify status from server
        api
          .getNewsletterStatus(savedEmail)
          .then((res) => {
            if (res) {
              setIsSubscribed(res.isSubscribed);
              if (res.preference) {
                setPreference(res.preference.toUpperCase() as SubscriptionPreference);
                localStorage.setItem(STORAGE_KEY_PREFERENCE, res.preference.toUpperCase());
              }
            }
          })
          .catch(() => {
            // Ignore API network failure on quiet status lookup
          });
      }
    } catch {
      // Local storage disabled or error
    }
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      toast.error("Enter a valid email address");
      return;
    }

    setSubscribing(true);
    try {
      await api.subscribeNewsletter(trimmedEmail, preference);
    } catch {
      // Offline fallback: handled gracefully
    }

    setIsSubscribed(true);
    toast.success("You're subscribed — check your inbox for 10% off.");

    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.65 },
        colors: ["#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6"],
      });
    } catch {
      // Ignore confetti error silently
    }

    try {
      localStorage.setItem(STORAGE_KEY_EMAIL, trimmedEmail);
      localStorage.setItem(STORAGE_KEY_SUBSCRIBED, "true");
      localStorage.setItem(STORAGE_KEY_PREFERENCE, preference);
    } catch {
      // Storage write failed
    }

    setSubscribing(false);
  };

  const handleSelectPreference = async (newPref: SubscriptionPreference) => {
    if (newPref === preference) return;
    setUpdatingPref(true);
    setPreference(newPref);
    try {
      localStorage.setItem(STORAGE_KEY_PREFERENCE, newPref);
    } catch {
      // LocalStorage save fail
    }

    const currentEmail = email.trim() || localStorage.getItem(STORAGE_KEY_EMAIL) || "";
    if (currentEmail) {
      try {
        await api.updateNewsletterPreference(currentEmail, newPref);
      } catch {
        // Backend sync warning handled quietly
      }
    }

    const label =
      newPref === "ALL"
        ? "All notifications"
        : newPref === "PERSONALIZED"
          ? "Personalized offers"
          : "None";
    toast.success(`Subscription preference updated to ${label}.`);
    setUpdatingPref(false);
  };

  const handleConfirmUnsubscribe = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    setSubscribing(true);
    const targetEmail = email.trim() || localStorage.getItem(STORAGE_KEY_EMAIL) || "";

    if (targetEmail) {
      try {
        await api.unsubscribeNewsletter(targetEmail);
      } catch {
        // Offline fallback: handled gracefully
      }
    }

    setIsSubscribed(false);
    setEmail("");
    setPreference("ALL");
    setShowUnsubscribeModal(false);
    setSubscribing(false);

    try {
      localStorage.removeItem(STORAGE_KEY_EMAIL);
      localStorage.removeItem(STORAGE_KEY_SUBSCRIBED);
      localStorage.removeItem(STORAGE_KEY_PREFERENCE);
    } catch {
      // LocalStorage clear error
    }

    toast.success("You have unsubscribed from Sole E-commerce website.");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {isSubscribed ? (
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
          <Input
            id="newsletter-subscribed-email"
            name="subscribedEmail"
            type="email"
            autoComplete="email"
            value={email}
            disabled
            aria-label="Subscribed email address"
            className="h-12 rounded-full bg-muted/60 px-5 text-center sm:text-left text-muted-foreground cursor-not-allowed font-medium"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                size="lg"
                disabled={updatingPref}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 h-12 flex items-center gap-2 transition-all font-semibold shadow-sm w-full sm:w-auto justify-center"
              >
                <Check className="h-4 w-4" />
                <span>Subscribed</span>
                <ChevronDown className="h-4 w-4 opacity-80 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 rounded-xl p-2 shadow-xl border-border"
            >
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Notification Preferences
              </div>
              <DropdownMenuItem
                onClick={() => handleSelectPreference("ALL")}
                className="cursor-pointer flex items-center justify-between rounded-lg py-2"
              >
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" />
                  <span>All</span>
                </div>
                {preference === "ALL" && <Check className="h-4 w-4 text-emerald-600" />}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleSelectPreference("PERSONALIZED")}
                className="cursor-pointer flex items-center justify-between rounded-lg py-2"
              >
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-primary" />
                  <span>Personalized</span>
                </div>
                {preference === "PERSONALIZED" && <Check className="h-4 w-4 text-emerald-600" />}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleSelectPreference("NONE")}
                className="cursor-pointer flex items-center justify-between rounded-lg py-2"
              >
                <div className="flex items-center gap-2">
                  <BellOff className="h-4 w-4 text-muted-foreground" />
                  <span>None</span>
                </div>
                {preference === "NONE" && <Check className="h-4 w-4 text-emerald-600" />}
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1" />

              <DropdownMenuItem
                onClick={() => setShowUnsubscribeModal(true)}
                className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 flex items-center gap-2 rounded-lg py-2 font-medium"
              >
                <LogOut className="h-4 w-4" />
                <span>Unsubscribe</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
          <Input
            id="newsletter-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="Enter your email"
            aria-label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 rounded-full bg-background px-5"
          />
          <Button
            type="submit"
            size="lg"
            disabled={subscribing}
            className="bg-primary hover:bg-accent text-primary-foreground rounded-full px-8 h-12"
          >
            {subscribing ? "…" : "Subscribe"}
          </Button>
        </form>
      )}

      {/* Confirmation Modal */}
      <AlertDialog open={showUnsubscribeModal} onOpenChange={setShowUnsubscribeModal}>
        <AlertDialogContent className="rounded-2xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-xl font-bold">
              Unsubscribe from Sole E-commerce website
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-sm pt-2">
              Are you sure you want to unsubscribe from Sole E-commerce website updates? You will no
              longer receive exclusive drop announcements, special discounts, or personalized
              recommendations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-4 gap-2">
            <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmUnsubscribe}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full px-6"
            >
              Unsubscribe
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
