import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Check, 
  Zap, 
  Rocket, 
  Crown,
  Download,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { chlorophyTheme } from '../styles/chlorophy-theme';
import toast, { Toaster } from 'react-hot-toast';

export default function Billing() {
  const [currentPlan, setCurrentPlan] = useState('free');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '0',
      icon: Zap,
      color: chlorophyTheme.colors.primary,
      features: [
        '5 websites per month',
        'Basic templates',
        'Community support',
        'Export to ZIP',
        'Standard quality',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '29',
      icon: Rocket,
      color: chlorophyTheme.colors.secondary,
      popular: true,
      features: [
        'Unlimited websites',
        'Premium templates',
        'Priority support',
        'Deploy to Vercel',
        'High quality generation',
        'Custom domains',
        'Analytics dashboard',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '99',
      icon: Crown,
      color: chlorophyTheme.colors.accent,
      features: [
        'Everything in Pro',
        'Dedicated support',
        'Custom AI training',
        'API access',
        'Team collaboration',
        'White-label option',
        'SLA guarantee',
        'Custom integrations',
      ],
    },
  ];

  const usageStats = [
    { label: 'Websites Created', value: '12', max: currentPlan === 'free' ? '5' : '∞', percentage: currentPlan === 'free' ? 240 : 0 },
    { label: 'Storage Used', value: '2.4 GB', max: '10 GB', percentage: 24 },
    { label: 'API Calls', value: '1.2K', max: currentPlan === 'free' ? '5K' : '∞', percentage: 24 },
  ];

  const invoices = [
    { id: 'INV-001', date: 'Nov 1, 2024', amount: '$29.00', status: 'paid', plan: 'Pro' },
    { id: 'INV-002', date: 'Oct 1, 2024', amount: '$29.00', status: 'paid', plan: 'Pro' },
    { id: 'INV-003', date: 'Sep 1, 2024', amount: '$29.00', status: 'paid', plan: 'Pro' },
  ];

  const handleUpgrade = (planId) => {
    if (planId === currentPlan) return;
    
    toast.success(`Upgrading to ${plans.find(p => p.id === planId).name} plan...`, {
      icon: '🚀',
      style: {
        background: chlorophyTheme.colors.dark,
        color: chlorophyTheme.colors.primary,
        border: `1px solid ${chlorophyTheme.colors.primary}40`,
      },
    });
    
    // Simulate upgrade
    setTimeout(() => {
      setCurrentPlan(planId);
      toast.success('Plan upgraded successfully!', {
        icon: '✅',
      });
    }, 2000);
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <Toaster position="top-right" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 
          className="text-4xl font-bold mb-2"
          style={{
            fontFamily: chlorophyTheme.fonts.display,
            background: chlorophyTheme.colors.gradients.primary,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Billing & Plans
        </h1>
        <p 
          className="text-lg"
          style={{ 
            color: '#ffffff80',
            fontFamily: chlorophyTheme.fonts.body,
          }}
        >
          Choose the perfect plan for your needs
        </p>
      </motion.div>

      {/* Usage Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-3 gap-6 mb-8"
      >
        {usageStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-2xl backdrop-blur-xl"
            style={{
              background: 'rgba(10, 14, 39, 0.8)',
              border: `1px solid ${chlorophyTheme.colors.primary}20`,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <span 
                className="text-sm font-medium"
                style={{ color: '#ffffff80' }}
              >
                {stat.label}
              </span>
              <TrendingUp size={18} style={{ color: chlorophyTheme.colors.primary }} />
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span 
                className="text-3xl font-bold"
                style={{ 
                  color: chlorophyTheme.colors.primary,
                  fontFamily: chlorophyTheme.fonts.display,
                }}
              >
                {stat.value}
              </span>
              <span style={{ color: '#ffffff60' }}>/ {stat.max}</span>
            </div>
            {stat.percentage > 0 && (
              <div 
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ background: 'rgba(255, 255, 255, 0.1)' }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(stat.percentage, 100)}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                  className="h-full"
                  style={{
                    background: stat.percentage > 100 
                      ? 'linear-gradient(90deg, #FF4757, #FFA500)'
                      : chlorophyTheme.colors.gradients.primary,
                  }}
                />
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Plans Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-3 gap-6 mb-8"
      >
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = currentPlan === plan.id;

          return (
            <motion.div
              key={plan.id}
              className="relative rounded-2xl backdrop-blur-xl overflow-hidden"
              whileHover={{ scale: 1.02 }}
              style={{
                background: 'rgba(10, 14, 39, 0.8)',
                border: `2px solid ${isCurrent ? plan.color : `${plan.color}40`}`,
                boxShadow: isCurrent ? `0 0 40px ${plan.color}40` : 'none',
              }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div 
                  className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    background: plan.color,
                    color: chlorophyTheme.colors.dark,
                  }}
                >
                  POPULAR
                </div>
              )}

              {/* Current Plan Badge */}
              {isCurrent && (
                <div 
                  className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"
                  style={{
                    background: `${plan.color}30`,
                    color: plan.color,
                    border: `1px solid ${plan.color}`,
                  }}
                >
                  <Check size={14} />
                  CURRENT
                </div>
              )}

              <div className="p-8">
                {/* Icon & Name */}
                <div className="flex items-center gap-3 mb-6 mt-4">
                  <div 
                    className="p-3 rounded-xl"
                    style={{
                      background: `${plan.color}20`,
                    }}
                  >
                    <Icon size={28} style={{ color: plan.color }} />
                  </div>
                  <div>
                    <h3 
                      className="text-2xl font-bold"
                      style={{
                        color: plan.color,
                        fontFamily: chlorophyTheme.fonts.display,
                      }}
                    >
                      {plan.name}
                    </h3>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span 
                      className="text-5xl font-bold"
                      style={{
                        color: '#ffffff',
                        fontFamily: chlorophyTheme.fonts.display,
                      }}
                    >
                      ${plan.price}
                    </span>
                    <span style={{ color: '#ffffff60' }}>/month</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li 
                      key={index}
                      className="flex items-start gap-3 text-sm"
                    >
                      <Check 
                        size={18} 
                        className="flex-shrink-0 mt-0.5"
                        style={{ color: plan.color }} 
                      />
                      <span style={{ color: '#ffffff' }}>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <motion.button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isCurrent}
                  className="w-full py-4 rounded-xl font-bold text-lg"
                  whileHover={{ scale: isCurrent ? 1 : 1.05 }}
                  whileTap={{ scale: isCurrent ? 1 : 0.95 }}
                  style={{
                    background: isCurrent 
                      ? 'rgba(255, 255, 255, 0.1)'
                      : `linear-gradient(135deg, ${plan.color}, ${plan.color}CC)`,
                    color: isCurrent ? '#ffffff60' : chlorophyTheme.colors.dark,
                    cursor: isCurrent ? 'default' : 'pointer',
                  }}
                >
                  {isCurrent ? 'Current Plan' : `Upgrade to ${plan.name}`}
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Invoices */}
      {currentPlan !== 'free' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl backdrop-blur-xl overflow-hidden"
          style={{
            background: 'rgba(10, 14, 39, 0.8)',
            border: `1px solid ${chlorophyTheme.colors.primary}20`,
          }}
        >
          <div 
            className="p-6 border-b flex items-center justify-between"
            style={{ borderColor: `${chlorophyTheme.colors.primary}20` }}
          >
            <div className="flex items-center gap-3">
              <Calendar size={24} style={{ color: chlorophyTheme.colors.primary }} />
              <h2 
                className="text-2xl font-bold"
                style={{
                  color: chlorophyTheme.colors.primary,
                  fontFamily: chlorophyTheme.fonts.display,
                }}
              >
                Billing History
              </h2>
            </div>
          </div>

          <div className="divide-y" style={{ borderColor: `${chlorophyTheme.colors.primary}10` }}>
            {invoices.map((invoice) => (
              <div 
                key={invoice.id}
                className="p-6 flex items-center justify-between hover:bg-white/5 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: `${chlorophyTheme.colors.primary}20`,
                    }}
                  >
                    <CreditCard size={24} style={{ color: chlorophyTheme.colors.primary }} />
                  </div>
                  <div>
                    <p 
                      className="font-semibold mb-1"
                      style={{ color: '#ffffff' }}
                    >
                      {invoice.id} - {invoice.plan} Plan
                    </p>
                    <p className="text-sm" style={{ color: '#ffffff60' }}>
                      {invoice.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span 
                    className="text-xl font-bold"
                    style={{ 
                      color: chlorophyTheme.colors.primary,
                      fontFamily: chlorophyTheme.fonts.display,
                    }}
                  >
                    {invoice.amount}
                  </span>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: `${chlorophyTheme.colors.primary}20`,
                      color: chlorophyTheme.colors.primary,
                    }}
                  >
                    {invoice.status.toUpperCase()}
                  </span>
                  <motion.button
                    className="p-2 rounded-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                      background: `${chlorophyTheme.colors.primary}20`,
                    }}
                  >
                    <Download size={18} style={{ color: chlorophyTheme.colors.primary }} />
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}