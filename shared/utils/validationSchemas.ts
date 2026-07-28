import { z } from 'zod';

const login = (t: any) =>
  z.object({
    login: z.string().nonempty(t('field_is_required')),
    password: z
      .string()
      .min(6, t('errors.password_min_length', { count: 6 }))
      .nonempty(t('field_is_required'))
    // .refine(val => /[A-Z]/.test(val), {
    //   message: t('errors.password_uppercase_required')
    // })
    // .refine(val => /[0-9]/.test(val), {
    //   message: t('errors.password_number_required')
    // })
    // .refine(val => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
    //   message: t('errors.password_symbol_required')
    // })
  });

const register = (t: any) =>
  z.object({
    email: z.email(t('invalid_email')).nonempty(t('field_is_required')),
    username: z.string().nonempty(t('field_is_required')),
    referralCode: z.string().optional(),
    password: z
      .string()
      .min(6, t('errors.password_min_length', { count: 6 }))
      .nonempty(t('field_is_required'))
      .refine(val => /[A-Z]/.test(val), {
        message: t('errors.password_uppercase_required')
      })
      .refine(val => /[0-9]/.test(val), {
        message: t('errors.password_number_required')
      })
      .refine(val => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
        message: t('errors.password_symbol_required')
      })
  });

const forgotPassword = (t: any) =>
  z.object({
    login: z.string().nonempty(t('field_is_required'))
  });

const passwordChange = (t: any, twoFactorRequired?: boolean) =>
  z
    .object({
      oldPassword: z
        .string()
        .min(6, t('errors.password_min_length', { count: 6 }))
        .nonempty(t('errors.field_is_required')),
      newPassword: z
        .string()
        .min(6, t('errors.password_min_length', { count: 6 }))
        .nonempty(t('errors.field_is_required'))
        .refine(val => /[A-Z]/.test(val), {
          message: t('errors.password_uppercase_required')
        })
        .refine(val => /[0-9]/.test(val), {
          message: t('errors.password_number_required')
        })
        .refine(val => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
          message: t('errors.password_symbol_required')
        }),
      confirmPassword: z
        .string()
        .min(6, t('errors.password_min_length', { count: 6 }))
        .nonempty(t('errors.field_is_required'))
        .refine(val => /[A-Z]/.test(val), {
          message: t('errors.password_uppercase_required')
        })
        .refine(val => /[0-9]/.test(val), {
          message: t('errors.password_number_required')
        })
        .refine(val => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
          message: t('errors.password_symbol_required')
        }),
      twoFactorCode: twoFactorRequired ? z.string().nonempty(t('errors.field_is_required')) : z.string().optional()
    })
    .superRefine(({ confirmPassword, newPassword }, ctx) => {
      if (confirmPassword !== newPassword) {
        ctx.addIssue({
          code: 'custom',
          message: t('errors.passwordsDontMatch'),
          path: ['confirmPassword']
        });
      }
    });

const resetPassword = (t: any) =>
  z
    .object({
      newPassword: z
        .string()
        .min(6, t('errors.password_min_length', { count: 6 }))
        .nonempty(t('errors.field_is_required'))
        .refine(val => /[A-Z]/.test(val), {
          message: t('errors.password_uppercase_required')
        })
        .refine(val => /[0-9]/.test(val), {
          message: t('errors.password_number_required')
        })
        .refine(val => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
          message: t('errors.password_symbol_required')
        }),
      confirmPassword: z
        .string()
        .min(6, t('errors.password_min_length', { count: 6 }))
        .nonempty(t('errors.field_is_required'))
        .refine(val => /[A-Z]/.test(val), {
          message: t('errors.password_uppercase_required')
        })
        .refine(val => /[0-9]/.test(val), {
          message: t('errors.password_number_required')
        })
        .refine(val => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
          message: t('errors.password_symbol_required')
        })
    })
    .superRefine(({ confirmPassword, newPassword }, ctx) => {
      if (confirmPassword !== newPassword) {
        ctx.addIssue({
          code: 'custom',
          message: t('errors.passwordsDontMatch'),
          path: ['confirmPassword']
        });
      }
    });

const twoFactorAuthentication = (t: any) =>
  z.object({
    secret: z.string().nonempty(t('errors.field_is_required')),
    password: z
      .string()
      .min(8, t('errors.password_min_length', { count: 8 }))
      .nonempty(t('errors.field_is_required'))
      .refine(val => /[A-Z]/.test(val), {
        message: t('errors.password_uppercase_required')
      })
      .refine(val => /[0-9]/.test(val), {
        message: t('errors.password_number_required')
      })
      .refine(val => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
        message: t('errors.password_symbol_required')
      }),
    token: z.string().nonempty(t('errors.field_is_required'))
  });

const withdrawal = (t: any, cryptoBalance?: string) =>
  z.object({
    walletAddress: z.string().nonempty(t('field_is_required')),
    amount: z
      .string()
      .nonempty(t('field_is_required'))
      // Use Number.isFinite — NOT the global isFinite (which coerces "" -> true)
      // and NOT !isNaN (which allows "Infinity"). Both bugs let NaN/Infinity
      // through to the withdrawal mutation.
      .refine(
        val => {
          const parsed = Number(val);
          return Number.isFinite(parsed) && parsed > 0;
        },
        {
          message: t('invalid_amount')
        }
      )
      .refine(
        val => {
          if (!cryptoBalance) return true;
          const parsedBalance = Number(cryptoBalance);
          if (!Number.isFinite(parsedBalance)) return true;
          return Number(val) <= parsedBalance;
        },
        {
          message: t('insufficient_balance')
        }
      ),
    tag: z.string().optional(),
    twoFactorCode: z.string().optional()
  });

// Union schema function
export const authUnionSchema = (t: any) => z.union([login(t), register(t)]);

// ayrıca ayrı ayrı export edebilirsin
export const authSchemas = {
  login,
  register,
  forgotPassword,
  passwordChange,
  resetPassword,
  twoFactorAuthentication,
  withdrawal
};
