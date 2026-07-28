'use client';

import { useState } from 'react';

import Alert from './Alert';

// Example component showing all Alert variants and usage patterns
export default function AlertExamples() {
  const [visibleAlerts, setVisibleAlerts] = useState<Record<string, boolean>>({
    success: true,
    error: true,
    warning: true,
    info: true,
    toshi: true,
    toshiNeon: true,
    announcement: true,
    promotion: true,
    maintenance: true,
    security: true,
    subtle: true
  });

  const dismissAlert = (key: string) => {
    setVisibleAlerts(prev => ({ ...prev, [key]: false }));
  };

  return (
    <div className="space-y-6 p-6 bg-toshi_body min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white mb-8">Alert Component Examples</h1>

        {/* Standard Variants */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Standard Variants</h2>

          <Alert
            variant="success"
            title=""
            description="Your action was completed successfully."
            visible={visibleAlerts.success}
            onDismiss={() => dismissAlert('success')}
            dismissible
          />

          <Alert
            variant="error"
            title="Error occurred"
            description="Something went wrong. Please try again."
            visible={visibleAlerts.error}
            onDismiss={() => dismissAlert('error')}
            dismissible
          />

          <Alert
            variant="warning"
            title="Warning"
            description="Please be careful with this action."
            visible={visibleAlerts.warning}
            onDismiss={() => dismissAlert('warning')}
            dismissible
          />

          <Alert
            variant="info"
            title="Information"
            description="Here's some useful information for you."
            visible={visibleAlerts.info}
            onDismiss={() => dismissAlert('info')}
            dismissible
          />
        </section>

        {/* Toshi Casino Variants */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Toshi Casino Variants</h2>

          <Alert
            variant="toshi"
            title="Toshi Alert"
            description="This is a Toshi-themed alert with our brand colors."
            visible={visibleAlerts.toshi}
            onDismiss={() => dismissAlert('toshi')}
            dismissible
          />

          <Alert
            variant="toshiNeon"
            title="Neon Alert"
            description="This alert has a bright neon green glow effect."
            visible={visibleAlerts.toshiNeon}
            onDismiss={() => dismissAlert('toshiNeon')}
            dismissible
          />

          <Alert
            variant="announcement"
            title="🎉 Special Announcement"
            description="Developer Nordan will be in chat giving away his $$$ to random people all night, spread the word!"
            visible={visibleAlerts.announcement}
            onDismiss={() => dismissAlert('announcement')}
            dismissible
            size="lg"
          />

          <Alert
            variant="promotion"
            title="🔥 Hot Promotion"
            description="Get 200% bonus on your first deposit! Limited time offer."
            visible={visibleAlerts.promotion}
            onDismiss={() => dismissAlert('promotion')}
            dismissible
          />

          <Alert
            variant="maintenance"
            title="🔧 Maintenance Notice"
            description="Scheduled maintenance will occur tonight from 2-4 AM UTC."
            visible={visibleAlerts.maintenance}
            onDismiss={() => dismissAlert('maintenance')}
            dismissible
          />

          <Alert
            variant="security"
            title="🛡️ Security Alert"
            description="Please verify your account to ensure maximum security."
            visible={visibleAlerts.security}
            onDismiss={() => dismissAlert('security')}
            dismissible
          />
        </section>

        {/* Different Sizes */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Different Sizes</h2>

          <Alert variant="info" title="Small Alert" description="This is a small sized alert." size="sm" />

          <Alert
            variant="success"
            title="Medium Alert"
            description="This is a medium sized alert (default)."
            size="md"
          />

          <Alert variant="warning" title="Large Alert" description="This is a large sized alert." size="lg" />

          <Alert
            variant="error"
            title="Extra Large Alert"
            description="This is an extra large sized alert."
            size="xl"
          />
        </section>

        {/* Different Layouts */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Different Layouts</h2>

          <Alert
            variant="info"
            title="Horizontal Layout"
            description="This is the default horizontal layout."
            layout="horizontal"
          />

          <Alert
            variant="success"
            title="Vertical Layout"
            description="This is a vertical layout with content stacked."
            layout="vertical"
          />

          <Alert
            variant="warning"
            title="Compact Layout"
            description="This is a compact layout for tight spaces."
            layout="compact"
          />
        </section>

        {/* With Custom Icons and Images */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Custom Icons and Images</h2>

          <Alert
            variant="toshiNeon"
            title="Custom Icon"
            description="This alert uses a custom icon."
            icon={
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            }
          />

          <Alert
            variant="announcement"
            title="With Avatar"
            description="This alert includes a user avatar image."
            image="https://static.toshi.bet/public/samurai.png?w=200&fit=min&auto=format"
          />

          <Alert variant="info" title="No Icon" description="This alert has no icon." showIcon={false} />
        </section>

        {/* Different Animations */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Different Animations</h2>

          <Alert
            variant="success"
            title="Slide Animation"
            description="This alert slides in from the left."
            animation="slide"
          />

          <Alert variant="info" title="Fade Animation" description="This alert fades in smoothly." animation="fade" />

          <Alert
            variant="warning"
            title="Scale Animation"
            description="This alert scales in with a bounce effect."
            animation="scale"
          />

          <Alert variant="error" title="No Animation" description="This alert has no animation." animation="none" />
        </section>

        {/* Complex Content */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Complex Content</h2>

          <Alert
            variant="announcement"
            title="🎰 New Game Release!"
            description="Check out our latest slot game with amazing graphics and huge jackpots!"
            size="lg"
          >
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-toshi-green-neon rounded-full"></span>
                <span>Available now in the casino</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-toshi-primary rounded-full"></span>
                <span>200% bonus for first 100 players</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-toshi-blue-neon rounded-full"></span>
                <span>Progressive jackpot starting at $10,000</span>
              </div>
            </div>
          </Alert>
        </section>

        {/* Subtle Variants */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Subtle Variants</h2>

          <Alert variant="subtle" title="Subtle Alert" description="This is a subtle alert with minimal styling." />

          <Alert variant="ghost" title="Ghost Alert" description="This is a ghost alert with transparent background." />
        </section>
      </div>
    </div>
  );
}
