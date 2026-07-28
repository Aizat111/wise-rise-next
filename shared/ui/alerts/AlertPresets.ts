// Predefined alert configurations for common use cases

export const alertPresets = {
  // Success messages
  success: {
    depositSuccess: {
      variant: 'success' as const,
      title: 'Deposit Successful',
      description: 'Your deposit has been processed successfully.',
      duration: 5000,
      dismissible: true
    },
    withdrawalSuccess: {
      variant: 'success' as const,
      title: 'Withdrawal Processed',
      description: 'Your withdrawal request has been submitted and will be processed within 24 hours.',
      duration: 5000,
      dismissible: true
    },
    profileUpdated: {
      variant: 'success' as const,
      title: 'Profile Updated',
      description: 'Your profile information has been updated successfully.',
      duration: 3000,
      dismissible: true
    },
    passwordChanged: {
      variant: 'success' as const,
      title: 'Password Changed',
      description: 'Your password has been updated successfully.',
      duration: 3000,
      dismissible: true
    }
  },

  // Error messages
  error: {
    depositFailed: {
      variant: 'error' as const,
      title: 'Deposit Failed',
      description: 'Your deposit could not be processed. Please try again or contact support.',
      duration: 0,
      dismissible: true
    },
    withdrawalFailed: {
      variant: 'error' as const,
      title: 'Withdrawal Failed',
      description: 'Your withdrawal request could not be processed. Please check your balance and try again.',
      duration: 0,
      dismissible: true
    },
    networkError: {
      variant: 'error' as const,
      title: 'Network Error',
      description: 'Unable to connect to the server. Please check your internet connection.',
      duration: 0,
      dismissible: true
    },
    sessionExpired: {
      variant: 'error' as const,
      title: 'Session Expired',
      description: 'Your session has expired. Please log in again.',
      duration: 0,
      dismissible: true
    }
  },

  // Warning messages
  warning: {
    lowBalance: {
      variant: 'warning' as const,
      title: 'Low Balance',
      description: 'Your account balance is running low. Consider making a deposit.',
      duration: 0,
      dismissible: true
    },
    maintenanceWarning: {
      variant: 'warning' as const,
      title: 'Maintenance Scheduled',
      description: 'Scheduled maintenance will begin in 30 minutes. Please save your progress.',
      duration: 0,
      dismissible: true
    },
    suspiciousActivity: {
      variant: 'warning' as const,
      title: 'Suspicious Activity Detected',
      description: 'We detected unusual activity on your account. Please verify your identity.',
      duration: 0,
      dismissible: true
    }
  },

  // Info messages
  info: {
    newFeature: {
      variant: 'info' as const,
      title: 'New Feature Available',
      description: 'Check out our latest game releases and features in the casino section.',
      duration: 5000,
      dismissible: true
    },
    systemUpdate: {
      variant: 'info' as const,
      title: 'System Update',
      description: 'We have updated our system with new features and improvements.',
      duration: 5000,
      dismissible: true
    }
  },

  // Toshi Casino specific
  toshi: {
    welcomeBonus: {
      variant: 'toshi' as const,
      title: '🎉 Welcome Bonus!',
      description: 'Get 200% bonus on your first deposit up to $1000!',
      duration: 0,
      dismissible: true
    },
    jackpotWin: {
      variant: 'toshiNeon' as const,
      title: '🎰 JACKPOT WIN!',
      description: 'Congratulations! You won the progressive jackpot!',
      duration: 0,
      dismissible: true
    },
    vipLevelUp: {
      variant: 'toshiBlue' as const,
      title: '⭐ VIP Level Up!',
      description: 'You have reached a new VIP level with exclusive benefits!',
      duration: 5000,
      dismissible: true
    },
    dailyReward: {
      variant: 'toshiPurple' as const,
      title: '🎁 Daily Reward',
      description: 'Your daily reward is ready! Claim it now in the rewards section.',
      duration: 0,
      dismissible: true
    }
  },

  // Announcements
  announcement: {
    developerChat: {
      variant: 'announcement' as const,
      title: '🎉 Developer Nordan in Chat!',
      description: 'Developer Nordan will be in chat giving away his $$$ to random people all night, spread the word!',
      duration: 0,
      dismissible: true,
      size: 'lg' as const
    },
    tournamentStart: {
      variant: 'announcement' as const,
      title: '🏆 Tournament Starting!',
      description: 'The weekly slot tournament is starting now! Join and compete for the $10,000 prize pool.',
      duration: 0,
      dismissible: true
    },
    newGameRelease: {
      variant: 'announcement' as const,
      title: '🎰 New Game Release!',
      description: 'Check out our latest slot game with amazing graphics and huge jackpots!',
      duration: 0,
      dismissible: true
    }
  },

  // Promotions
  promotion: {
    depositBonus: {
      variant: 'promotion' as const,
      title: '🔥 Hot Promotion!',
      description: 'Get 200% bonus on your first deposit! Limited time offer.',
      duration: 0,
      dismissible: true
    },
    weekendSpecial: {
      variant: 'promotion' as const,
      title: '🎊 Weekend Special',
      description: 'Double rewards on all games this weekend!',
      duration: 0,
      dismissible: true
    },
    referralBonus: {
      variant: 'promotion' as const,
      title: '👥 Referral Bonus',
      description: 'Invite friends and earn $50 for each successful referral!',
      duration: 0,
      dismissible: true
    }
  },

  // Maintenance
  maintenance: {
    scheduledMaintenance: {
      variant: 'maintenance' as const,
      title: '🔧 Scheduled Maintenance',
      description: 'Scheduled maintenance will occur tonight from 2-4 AM UTC.',
      duration: 0,
      dismissible: true
    },
    emergencyMaintenance: {
      variant: 'maintenance' as const,
      title: '⚠️ Emergency Maintenance',
      description: 'We are performing emergency maintenance. Services will be restored shortly.',
      duration: 0,
      dismissible: true
    }
  },

  // Security
  security: {
    accountVerification: {
      variant: 'security' as const,
      title: '🛡️ Account Verification Required',
      description: 'Please verify your account to ensure maximum security.',
      duration: 0,
      dismissible: true
    },
    loginFromNewDevice: {
      variant: 'security' as const,
      title: '🔐 New Device Login',
      description: 'We detected a login from a new device. If this was not you, please change your password.',
      duration: 0,
      dismissible: true
    },
    twoFactorEnabled: {
      variant: 'security' as const,
      title: '🔒 Two-Factor Authentication Enabled',
      description: 'Two-factor authentication has been enabled for your account.',
      duration: 5000,
      dismissible: true
    }
  }
};

// Helper function to get alert preset
export function getAlertPreset(category: keyof typeof alertPresets, key: string) {
  return alertPresets[category]?.[key as keyof (typeof alertPresets)[typeof category]];
}

// Helper function to get all alerts from a category
export function getAlertsFromCategory(category: keyof typeof alertPresets) {
  return Object.values(alertPresets[category] || {});
}
