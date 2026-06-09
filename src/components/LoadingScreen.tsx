import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-pink-50"
    >
      <div className="w-full max-w-sm px-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 shadow-lg">
          <span className="text-lg font-bold text-white">P</span>
        </div>

        <p className="text-base font-semibold text-gray-800">PixArt</p>
        <p className="mt-1 text-sm text-gray-500">Đừng giữ cho riêng mình, hãy để thế giới chiêm ngưỡng.</p>

      </div>
    </motion.div>
  );
}
