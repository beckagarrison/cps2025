import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Check, Crown, Zap, FileText, Podcast, FileEdit, Shield, Brain, Scale } from "lucide-react";
import { Badge } from "./ui/badge";
import { useSubscription } from "../contexts/SubscriptionContext";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

export function SubscriptionModal({ isOpen, onClose, feature }: SubscriptionModalProps) {
  const { tier, upgradeToPremium } = useSubscription();

  const handleUpgrade = () => {
    // In a real app, this would open Stripe checkout
    // For now, we'll just upgrade them
    upgradeToPremium();
    onClose();
  };

  const freeFeatures = [
    "Upload up to 3 case documents",
    "Generate up to 5 legal documents",
    "Generate 1 case analysis podcast",
    "Basic violation detection",
    "Timeline builder",
    "Evidence checklist",
  ];

  const premiumFeatures = [
    "Unlimited document uploads",
    "Unlimited document generation",
    "Unlimited podcast generation",
    "Advanced AI violation detection",
    "Modern case law references (2020-2025)",
    "Sophisticated defense strategies",
    "Priority email support",
    "Export all documents as PDF",
    "Custom affidavit templates",
    "Constitutional rights guide",
  ];

  const limitedFeatures = [
    { icon: FileText, name: "Document Uploads", free: "3 documents", premium: "Unlimited" },
    { icon: FileEdit, name: "Document Generation", free: "5 documents", premium: "Unlimited" },
    { icon: Podcast, name: "AI Podcast", free: "1 podcast", premium: "Unlimited" },
    { icon: Brain, name: "AI Analysis", free: "Basic", premium: "Advanced" },
    { icon: Scale, name: "Case Law", free: "Limited", premium: "Full (2020-2025)" },
    { icon: Shield, name: "Defense Strategies", free: "Basic", premium: "Sophisticated" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Crown className="w-6 h-6 text-yellow-500" />
            Upgrade to Premium
          </DialogTitle>
          <DialogDescription>
            {feature 
              ? `You've reached the limit for ${feature}. Upgrade to Premium for unlimited access.`
              : "Get unlimited access to all features and fight for your family rights with powerful AI tools."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Comparison Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            {limitedFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-5 h-5 text-primary" />
                    <div className="text-sm">{feature.name}</div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="text-muted-foreground">Free: {feature.free}</div>
                    <div className="text-primary flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      Premium: {feature.premium}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Free Plan */}
            <Card className="p-6 border-2">
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    Free Plan
                    {tier === 'free' && <Badge>Current</Badge>}
                  </div>
                  <div className="text-3xl mb-1">$0</div>
                  <p className="text-sm text-muted-foreground">Forever free, limited features</p>
                </div>
                <div className="space-y-2">
                  {freeFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full" disabled={tier === 'free'}>
                  {tier === 'free' ? 'Current Plan' : 'Downgrade'}
                </Button>
              </div>
            </Card>

            {/* Premium Plan */}
            <Card className="p-6 border-2 border-primary relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-3 py-1">
                MOST POPULAR
              </div>
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-500" />
                    Premium Plan
                    {tier === 'premium' && <Badge variant="default">Current</Badge>}
                  </div>
                  <div className="flex items-baseline gap-2 mb-1">
                    <div className="text-3xl">$20</div>
                    <span className="text-base text-muted-foreground">/month</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">Save 33%</Badge>
                    <span className="text-xs text-muted-foreground line-through">$29.99</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Unlimited access, cancel anytime</p>
                </div>
                <div className="space-y-2">
                  {premiumFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleUpgrade}
                  disabled={tier === 'premium'}
                >
                  {tier === 'premium' ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Current Plan
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Upgrade Now
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Money Back Guarantee */}
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-green-600 flex-shrink-0" />
              <div>
                <div className="text-sm mb-1 text-green-900">30-Day Money-Back Guarantee</div>
                <p className="text-xs text-green-700">
                  If you're not satisfied with Premium, we'll refund your money within 30 days. No questions asked.
                </p>
              </div>
            </div>
          </Card>

          {/* Value Proposition */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="text-center">
                <div className="text-2xl mb-1">$0.67</div>
                <p className="text-xs text-blue-700">per day to defend your family</p>
              </div>
            </Card>
            <Card className="p-4 bg-purple-50 border-purple-200">
              <div className="text-center">
                <div className="text-2xl mb-1">Unlimited</div>
                <p className="text-xs text-purple-700">AI-powered legal analysis</p>
              </div>
            </Card>
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="text-center">
                <div className="text-2xl mb-1">24/7</div>
                <p className="text-xs text-green-700">Access to all features</p>
              </div>
            </Card>
          </div>

          {/* FAQ */}
          <div className="space-y-2">
            <div className="text-sm">Frequently Asked Questions</div>
            <div className="space-y-3 text-sm">
              <details className="cursor-pointer">
                <summary className="hover:text-primary">Can I cancel anytime?</summary>
                <p className="text-muted-foreground mt-1 ml-4">
                  Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
                </p>
              </details>
              <details className="cursor-pointer">
                <summary className="hover:text-primary">What payment methods do you accept?</summary>
                <p className="text-muted-foreground mt-1 ml-4">
                  We accept all major credit cards (Visa, Mastercard, American Express, Discover) through our secure payment processor Stripe.
                </p>
              </details>
              <details className="cursor-pointer">
                <summary className="hover:text-primary">Is my data secure?</summary>
                <p className="text-muted-foreground mt-1 ml-4">
                  Absolutely. We use bank-level encryption and never share your personal information. All case data is stored securely and privately.
                </p>
              </details>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}