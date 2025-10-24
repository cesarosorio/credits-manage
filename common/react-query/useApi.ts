/* eslint-disable @typescript-eslint/no-explicit-any */
import { isAxiosError } from 'axios';

import {
  InvalidateQueryFilters,
  QueryFunction,
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

// === useApiGet ===
const HTTP_STATUS_TO_NOT_RETRY = [400, 401, 403, 404, 500, 501, 502, 503, 504, 505, 506, 507, 508, 510, 511];
const MAX_RETRY = 3;

type ApiGetProps = {
  key: QueryKey;
  fn: Promise<any> | QueryFunction<unknown, QueryKey, never> | undefined;
  options?: any;
};

const useApiGet = <T>({ key, fn, options }: ApiGetProps) =>
  useQuery<T>({
    queryKey: key,
    queryFn: fn,
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      if (failureCount >= MAX_RETRY) {
        return false;
      }
      // retry if error is for network issue
      if (isAxiosError(error) && HTTP_STATUS_TO_NOT_RETRY.includes(error.response?.status ?? 0)) {
        return false;
      }

      if (error.statusCode && HTTP_STATUS_TO_NOT_RETRY.includes(error?.statusCode ?? 0)) {
        return false;
      }

      return true;
    },
    ...options,
  });

// === useApiSend ===

type ApiSendProps<T> = {
  fn: ((data: T) => Promise<any>) | (() => Promise<any>);
  success?: (data: any) => void;
  error?: (error: any) => void;
  invalidateKey?: InvalidateQueryFilters[] | undefined;
  /**
   * Invalidate query when queryKey starts with this string eg: ['shipments', { companyId: '1' }] , invalidateWhenStart: 'shipments' will invalidate this query
   */
  invalidateAllWhenStart?: string;
  options?: any;
};

const useApiSend = <T>({ fn, success, error, invalidateKey, invalidateAllWhenStart, options }: ApiSendProps<T>) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, T>({
    mutationFn: fn,
    onSuccess: (data) => {
      if (invalidateKey) {
        invalidateKey.forEach((key) => {
          queryClient.invalidateQueries(key);
        });
      }
      if (invalidateAllWhenStart) {
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] == invalidateAllWhenStart,
        });
      }

      if (success) success(data);
    },
    onError: error,
    retry: (failureCount, error: any) => {
      if (failureCount > 2) {
        return false;
      }
      // retry if error is for network issue
      if (isAxiosError(error) && HTTP_STATUS_TO_NOT_RETRY.includes(error.response?.status ?? 0)) {
        return false;
      }

      if (error.statusCode && HTTP_STATUS_TO_NOT_RETRY.includes(error?.statusCode ?? 0)) {
        return false;
      }

      return true;
    },
    ...options,
  });
};

export { useApiGet, useApiSend };
