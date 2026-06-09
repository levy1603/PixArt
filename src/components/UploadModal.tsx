import { useCallback, useEffect, useRef, useState } from 'react';
import { X, Upload, Image, Plus, Tag, Trash2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Post } from '../types';

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (data: {
    title: string;
    description: string;
    tags: string[];
    files: File[];
    category: Post['category'];
    isPublic: boolean;
  }) => void;
}

type SelectedImage = {
  id: string;
  file: File;
  previewUrl: string;
};

const MAX_IMAGES = 20;

export default function UploadModal({ open, onClose, onUpload }: UploadModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [dragOver, setDragOver] = useState(false);
  const [images, setImages] = useState<SelectedImage[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState<Post['category']>('illustration');
  const [isPublic, setIsPublic] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef<SelectedImage[]>([]);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, []);

  const addFiles = useCallback((incomingFiles: FileList | File[]) => {
    const imageFiles = Array.from(incomingFiles).filter((f) => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    setImages((prev) => {
      const availableSlots = Math.max(0, MAX_IMAGES - prev.length);
      if (availableSlots === 0) return prev;

      const filesToAdd = imageFiles.slice(0, availableSlots);
      const newItems = filesToAdd.map((file, index) => ({
        id: `${Date.now()}_${index}_${file.name}`,
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      return [...prev, ...newItems];
    });
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles],
  );

  const handleAddTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (t && !tags.includes(t) && tags.length < 10) {
      setTags((prev) => [...prev, t]);
      setTagInput('');
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const clearImages = () => {
    setImages((prev) => {
      prev.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      return [];
    });
  };

  const handleSubmit = async () => {
    if (images.length === 0 || !title.trim()) return;
    setUploading(true);
    await new Promise((r) => setTimeout(r, 1800));
    onUpload({
      title,
      description,
      tags,
      files: images.map((item) => item.file),
      category,
      isPublic,
    });
    setUploading(false);
    setDone(true);
    setTimeout(() => {
      handleClose();
    }, 1500);
  };

  const handleClose = () => {
    setStep(1);
    clearImages();
    setTitle('');
    setDescription('');
    setTags([]);
    setTagInput('');
    setCategory('illustration');
    setIsPublic(true);
    setUploading(false);
    setDone(false);
    onClose();
  };

  const coverImage = images[0];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                  <Upload size={15} className="text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">Dang tai tac pham</h2>
                  <p className="text-xs text-gray-400">Chia se nghe thuat cua ban voi cong dong</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X size={15} className="text-gray-600" />
              </button>
            </div>

            <div className="flex px-5 pt-4 gap-2">
              {[1, 2].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      s <= step ? 'bg-violet-500 text-white' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {s}
                  </div>
                  <span className={`text-xs font-medium ${s <= step ? 'text-violet-600' : 'text-gray-400'}`}>
                    {s === 1 ? 'Chon anh' : 'Thong tin'}
                  </span>
                  {s < 2 && <div className={`h-px w-8 ${step > s ? 'bg-violet-400' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>

            <div className="p-5">
              {done ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="py-12 flex flex-col items-center gap-3"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle size={32} className="text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Dang tai thanh cong!</h3>
                  <p className="text-sm text-gray-500">Tac pham cua ban da duoc chia se voi cong dong.</p>
                </motion.div>
              ) : step === 1 ? (
                <div className="space-y-4">
                  <div
                    className={`relative border-2 border-dashed rounded-2xl transition-all duration-200 ${
                      dragOver
                        ? 'border-violet-400 bg-violet-50'
                        : images.length > 0
                        ? 'border-violet-300 bg-gray-50'
                        : 'border-gray-200 bg-gray-50 hover:border-violet-300 hover:bg-violet-50/50'
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    style={{ cursor: 'pointer' }}
                  >
                    {images.length > 0 ? (
                      <div className="p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-xs font-semibold text-gray-700">{images.length} anh da chon</p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              clearImages();
                            }}
                            className="text-xs text-rose-500 hover:text-rose-600"
                          >
                            Xoa tat ca
                          </button>
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {images.map((item, index) => (
                            <div key={item.id} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-white">
                              <img
                                src={item.previewUrl}
                                alt={item.file.name}
                                className="w-full h-20 object-cover"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeImage(item.id);
                                }}
                                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white hidden group-hover:flex items-center justify-center"
                                aria-label="Xoa anh"
                              >
                                <Trash2 size={11} />
                              </button>
                              <div className="absolute bottom-1 left-1 text-[10px] px-1.5 py-0.5 rounded bg-black/60 text-white">
                                {index + 1}
                              </div>
                            </div>
                          ))}
                        </div>

                        <p className="mt-2 text-[11px] text-gray-400">
                          Ban co the keo tha hoac bam de them anh (toi da {MAX_IMAGES} anh)
                        </p>
                      </div>
                    ) : (
                      <div className="py-16 flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center">
                          <Image size={24} className="text-violet-500" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-gray-700">Keo & tha nhieu anh vao day</p>
                          <p className="text-xs text-gray-400 mt-1">hoac click de chon nhieu file</p>
                          <p className="text-xs text-gray-300 mt-1">JPG, PNG, GIF, WebP - toi da 20MB / file</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files) {
                        addFiles(e.target.files);
                        e.target.value = '';
                      }
                    }}
                  />

                  <button
                    onClick={() => images.length > 0 && setStep(2)}
                    disabled={images.length === 0}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                  >
                    Tiep tuc
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    {coverImage && (
                      <div className="relative w-24 h-24 shrink-0">
                        <img src={coverImage.previewUrl} alt="cover preview" className="w-24 h-24 object-cover rounded-xl" />
                        {images.length > 1 && (
                          <span className="absolute -bottom-1 -right-1 text-[10px] px-2 py-0.5 rounded-full bg-violet-500 text-white font-semibold">
                            +{images.length - 1}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex-1 space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 mb-1 block">Tieu de *</label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Nhap tieu de tac pham..."
                          className="w-full text-sm px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-violet-300 focus:outline-none transition-all"
                        />
                      </div>
                      <p className="text-xs text-gray-400">{images.length} anh se duoc dang trong cung 1 bai viet</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Mo ta</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Mo ta ve tac pham cua ban..."
                      rows={3}
                      className="w-full text-sm px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-violet-300 focus:outline-none transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Danh muc</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Post['category'])}
                      className="w-full text-sm px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-violet-300 focus:outline-none transition-all"
                    >
                      <option value="illustration">Illustration</option>
                      <option value="manga">Manga</option>
                      <option value="ugoira">Animation</option>
                      <option value="novel">Novel</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1 block">
                      <Tag size={12} /> Tags <span className="text-gray-400 font-normal">({tags.length}/10)</span>
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                        placeholder="Them tag..."
                        className="flex-1 text-sm px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-violet-300 focus:outline-none transition-all"
                      />
                      <button
                        onClick={handleAddTag}
                        className="w-9 h-9 rounded-xl bg-violet-100 text-violet-600 hover:bg-violet-200 flex items-center justify-center transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((t) => (
                        <span
                          key={t}
                          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-violet-50 text-violet-600 border border-violet-100 font-medium"
                        >
                          #{t}
                          <button
                            onClick={() => setTags((prev) => prev.filter((x) => x !== t))}
                            className="hover:text-rose-500 transition-colors"
                          >
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Hien thi cong khai</p>
                      <p className="text-xs text-gray-400">Moi nguoi deu co the xem tac pham nay</p>
                    </div>
                    <button
                      onClick={() => setIsPublic(!isPublic)}
                      className={`w-11 h-6 rounded-full transition-all relative ${isPublic ? 'bg-violet-500' : 'bg-gray-300'}`}
                    >
                      <div
                        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${
                          isPublic ? 'left-5.5 translate-x-0.5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm hover:bg-gray-200 transition-colors"
                    >
                      Quay lai
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={!title.trim() || uploading || images.length === 0}
                      className="flex-2 flex-[2] py-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      {uploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Dang dang tai...
                        </>
                      ) : (
                        <>
                          <Upload size={15} />
                          Dang tai
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
