import { motion, AnimatePresence } from 'motion/react';

interface SpeechBubbleProps {
  text: string;
  isVisible: boolean;
}

export default function SpeechBubble({ text, isVisible }: SpeechBubbleProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 10 }}
          className="absolute -top-16 left-1/2 -translate-x-1/2 z-20 w-max max-w-[150px]"
        >
          <div className="bg-white px-4 py-2 rounded-2xl shadow-lg border border-muted text-sm font-medium text-center relative">
            {text}
            {/* Triangle for the bubble */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-muted rotate-45" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
