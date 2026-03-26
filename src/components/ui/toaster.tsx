import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { useState, useEffect, useRef } from "react";

const TOAST_DURATION = 4000;

// Outline-style icons matching the image exactly
const SuccessIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="12.5" stroke="#22c55e" strokeWidth="2" />
    <path d="M8.5 14L12.5 18L19.5 10" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ErrorIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="12.5" stroke="#ef4444" strokeWidth="2" />
    <path d="M14 9v6M14 18.5v.5" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const InfoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="12.5" stroke="#3b82f6" strokeWidth="2" />
    <path d="M14 12v7M14 9.5v.5" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const VARIANT_CONFIG = {
  success: {
    icon: <SuccessIcon />,
    progressColor: 'bg-[#22c55e]',
    progressTrack: 'bg-green-100',
  },
  destructive: {
    icon: <ErrorIcon />,
    progressColor: 'bg-red-400',
    progressTrack: 'bg-red-100',
  },
  default: {
    icon: <InfoIcon />,
    progressColor: 'bg-blue-400',
    progressTrack: 'bg-blue-100',
  },
};

function ToastWithProgress({ title, description, action, variant, ...props }: any) {
  const v = (variant ?? 'default') as keyof typeof VARIANT_CONFIG;
  const config = VARIANT_CONFIG[v] ?? VARIANT_CONFIG.default;

  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  const remainingRef = useRef(TOAST_DURATION);
  const lastTickRef = useRef(Date.now());
  const rafRef = useRef<number>();

  useEffect(() => {
    const tick = () => {
      if (!isPaused) {
        const now = Date.now();
        remainingRef.current = Math.max(0, remainingRef.current - (now - lastTickRef.current));
        lastTickRef.current = now;
        setProgress((remainingRef.current / TOAST_DURATION) * 100);
      } else {
        lastTickRef.current = Date.now();
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isPaused]);

  return (
    <Toast
      variant={variant}
      duration={isPaused ? Infinity : TOAST_DURATION}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      {...props}
    >
      <div className="flex flex-col w-full gap-3">
        {/* Content row */}
        <div className="flex items-center gap-3 pr-7">
          {/* Outline icon — matches image */}
          <span className="shrink-0">{config.icon}</span>
          {/* Text */}
          <div className="flex-1 min-w-0">
            {title && (
              <ToastTitle className="text-gray-900 font-semibold text-[15px] leading-tight">
                {title}
              </ToastTitle>
            )}
            {description && (
              <ToastDescription className="text-gray-400 text-sm mt-0.5 leading-snug">
                {description}
              </ToastDescription>
            )}
          </div>
        </div>
        {/* Progress bar */}
        <div className={`h-1 w-full ${config.progressTrack} rounded-full overflow-hidden`}>
          <div
            className={`h-full rounded-full transition-none ${config.progressColor}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      {action}
      {/* Close button — fades in on hover */}
      <ToastClose className="absolute right-3 top-3 rounded-md p-1 text-gray-300 opacity-0 group-hover:opacity-100 hover:text-gray-600 transition-all duration-200 focus:outline-none focus:opacity-100" />
    </Toast>
  );
}

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider duration={TOAST_DURATION}>
      {toasts.map(({ id, title, description, action, variant, ...props }) => (
        <ToastWithProgress
          key={id}
          title={title}
          description={description}
          action={action}
          variant={variant}
          {...props}
        />
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}
