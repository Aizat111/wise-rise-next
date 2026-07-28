'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { useUserSocket } from './sockets/useUserSocket';
import { useAppSelector } from '@/core/redux-toolkit/hooks';
import { setBalance } from '@/core/redux-toolkit/slices/balanceSlice';
import { RootState, store } from '@/core/redux-toolkit/store';
import type { IUserBalanceResponse } from '@/core/types/user.types';

export function useBalance() {
  const { connected, on, off } = useUserSocket();
  const isGameActive = useAppSelector((state: RootState) => state.blackjack.gameActive);
  const isVideoPokerActive = useAppSelector((state: RootState) => state.videoPoker.gameActive);
  const isWheelProcessing = useAppSelector((state: RootState) => state.wheel.isProcessing);
  const isRouletteProcessing = useAppSelector((state: RootState) => state.roulette.isProcessing);
  const isBaccaratProcessing = useAppSelector((state: RootState) => state.baccarat.gameActive);
  const dispatch = useDispatch();

  const pendingBalanceRef = useRef<IUserBalanceResponse | null>(null);
  const flushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleFlush = (delay = 0) => {
    if (flushTimerRef.current) {
      clearTimeout(flushTimerRef.current);
      flushTimerRef.current = null;
    }
    flushTimerRef.current = setTimeout(() => {
      const active = store.getState().dice.isProcessing;
      if (active) {
        scheduleFlush(delay);
        return;
      }
      const response = pendingBalanceRef.current;
      if (response) {
        const newBalance = Math.floor((response.credits + response.freebets) * 100) / 100;
        dispatch(setBalance(newBalance));
        pendingBalanceRef.current = null;
      }
      flushTimerRef.current = null;
    }, delay);
  };

  // Allow explicit flush requests from game hooks (e.g., at round end)
  const flushNow = useCallback(() => {
    const response = pendingBalanceRef.current;
    if (response) {
      const newBalance = Math.floor((response.credits + response.freebets) * 100) / 100;
      pendingBalanceRef.current = null;
      dispatch(setBalance(newBalance));
    }
  }, [dispatch]);

  useEffect(() => {
    const handler = () => flushNow();
    if (typeof window !== 'undefined') {
      window.addEventListener('toshi:flushBalance', handler);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('toshi:flushBalance', handler);
      }
    };
  }, [flushNow]);

  // Blackjack-style delayed apply for increases; do not apply during dice processing
  useEffect(() => {
    if (
      !isGameActive &&
      !isVideoPokerActive &&
      !isWheelProcessing &&
      !isBaccaratProcessing &&
      !isRouletteProcessing &&
      pendingBalanceRef.current
    ) {
      const response = pendingBalanceRef.current;
      setTimeout(() => {
        dispatch(setBalance(Math.floor((response.credits + response.freebets) * 100) / 100));
      }, 500);
      pendingBalanceRef.current = null;
    }
  }, [isGameActive, isVideoPokerActive, isWheelProcessing, isBaccaratProcessing, dispatch]);

  useEffect(() => {
    const handleBalance = (response: IUserBalanceResponse) => {
      const currentBlackjackActive = store.getState().blackjack.gameActive;
      const currentVideoPokerActive = store.getState().videoPoker.gameActive;
      const currentWheelProcessing = store.getState().wheel.isProcessing;
      const currentDiceProcessing = store.getState().dice.isProcessing;
      const currentBaccaratProcessing = store.getState().baccarat.gameActive;
      const currentBalance = store.getState().balance.balance;
      const currentRouletteProcessing = store.getState().roulette.isProcessing;
      const newBalance = Math.floor((response.credits + response.freebets) * 100) / 100;

      // Dice path: always buffer and coalesce, flush at round end or when idle
      if (currentDiceProcessing) {
        pendingBalanceRef.current = response;
        scheduleFlush(100);
        return;
      }

      // Blackjack path: apply decreases immediately; buffer increases while active
      if (newBalance < currentBalance) {
        dispatch(setBalance(newBalance));
        return;
      }

      if (
        currentBlackjackActive ||
        currentVideoPokerActive ||
        currentWheelProcessing ||
        currentBaccaratProcessing ||
        currentRouletteProcessing
      ) {
        pendingBalanceRef.current = response;
        return;
      }
      dispatch(setBalance(newBalance));
    };

    if (connected) {
      on('user:balance', handleBalance);
    }
    return () => {
      if (flushTimerRef.current) {
        clearTimeout(flushTimerRef.current);
        flushTimerRef.current = null;
      }
      off('user:balance', handleBalance);
    };
  }, [connected, on, off, dispatch]);

  return null;
}
