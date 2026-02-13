import { create } from 'zustand';

interface PostModalStore {
  isOpen: boolean;
  postId: number | null;
  openPost: (id: number) => void;
  closePost: () => void;
}

export const usePostModalStore = create<PostModalStore>((set) => ({
  isOpen: false,
  postId: null,
  openPost: (id) => set({ isOpen: true, postId: id }),
  closePost: () => set({ isOpen: false, postId: null }),
}));
