// Type Definition
export interface ErrorCodeTypes {
  code: string;
  title: string;
  description: string | null;
}

export const ERROR_CODES: ErrorCodeTypes[] = [
  {
    code: 'Invalid password',
    title: 'errors.incorrect',
    description: 'errors.incorrectdesc'
  },
  {
    code: 'success_login',
    title: 'success.loggedin',
    description: 'success.loggedindesc'
  },
  {
    code: 'Invalid or expired token',
    title: 'errors.invalidToken',
    description: 'errors.invalidTokenDescription'
  },
  {
    code: 'You cannot tip yourself. Idiot.',
    title: 'errors.error',
    description: 'errors.cannot_tip_yourself'
  },
  {
    code: 'Not enough balance to place this bet',
    title: 'errors.insufficient_funds_title',
    description: 'errors.not_enough_balance'
  },
  {
    code: 'You must buy at least one ticket',
    title: 'errors.error',
    description: 'errors.must_buy_at_least_one_ticket'
  }
];
