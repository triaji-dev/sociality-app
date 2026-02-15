
import { InfiniteData } from "@tanstack/react-query";
import { Post, PaginatedResponse } from "@/types";

/**
 * Shared getNextPageParam for all infinite queries with standard pagination.
 * Eliminates duplication across 14+ hook usages.
 */
export function getStandardNextPageParam<T>(lastPage: PaginatedResponse<T>) {
  if (!lastPage.data) return undefined;
  const { page, totalPages } = lastPage.data.pagination;
  return page < totalPages ? page + 1 : undefined;
}

export type InfinitePostData = InfiniteData<PaginatedResponse<Post>>;

export function updatePostInInfiniteData(
  data: InfinitePostData | undefined,
  postId: number,
  updater: (post: Post) => Post,
): InfinitePostData | undefined {
  if (!data) return data;
  return {
    ...data,
    pages: data.pages.map((page) => {
      if (!page.data) return page;
      return {
        ...page,
        data: {
          ...page.data,
          items: page.data.items.map((post) =>
            post.id === postId ? updater(post) : post,
          ),
        },
      };
    }),
  };
}
